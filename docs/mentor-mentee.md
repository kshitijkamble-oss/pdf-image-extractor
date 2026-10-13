# Mentor and mentees

How Claude agents work together in this project. One **mentor** leads. Any number of **mentees** do the work.

## 1. Roles

### Mentor (the master)
- The mentor is the main Claude Code session — the one the user types into.
- It is the **only** agent that talks to the user. All user input comes in through the mentor. All output to the user goes out through the mentor.
- It does not do the hands-on work itself. It breaks work into tasks, spawns mentees, hands them tasks, checks their results, and reports back.
- It owns the **task board** (see section 5): the single record of what is done, what is in progress, and what is left.

### Mentee (the worker)
- A mentee is a subagent spawned by the mentor.
- It does one task at a time and reports back to the mentor — never to the user directly.
- It cannot see the mentor's conversation. Everything it needs must be in the task message.

## 2. Naming

- Every mentee is named `mentee <n>`, where `<n>` is the next unused number: `mentee 1`, `mentee 2`, `mentee 3`, …
- Numbers are never reused in one session. If `mentee 2` is retired, the next one is still `mentee 4`, not `mentee 2`. This keeps the log easy to follow.
- Pass the name as the Agent tool's `name` (and use it in the short `description`), so the mentor can reach it later with `SendMessage` by that name.
- A mentee that takes over from another one says so: `mentee 4 (continues mentee 2)`.

## 3. Spawning mentees

The user can ask for mentees at any time, for example:

- "spawn a mentee for task 3"
- "spawn 2 mentees and split the tests between them"

The mentor can also spawn mentees on its own when the plan needs them. Either way, the mentor:

1. Picks the next free number.
2. Picks the agent type that fits the task (`planner`, `builder`, later `tester`, `reviewer`). The type decides what tools the mentee has.
3. Writes a task message (template in section 6).
4. Records the new mentee on the task board.
5. Tells the user: "Spawned `mentee 3` (builder) for task 2: add the login form."

Rules for running mentees at the same time:
- Only run mentees in parallel when their tasks do not touch the same files.
- If two tasks touch the same files, run them one after the other.

## 4. The main loop

```
user ──► mentor ──► mentee n ──► mentor ──► user
          ▲                         │
          └──── next task / handoff ┘
```

1. **User asks** for something.
2. **Mentor plans.** It turns the request into small numbered tasks (it can use the `planner` agent for this). It shows the plan to the user and waits for an OK.
3. **Mentor assigns.** It spawns a mentee for the next task.
4. **Mentee works** and returns one of two reports:
   - a **done report** — the task is finished, or
   - a **handoff report** — it is running out of room (section 7).
5. **Mentor checks** the report. Does it match the task? Did the checks pass? If the mentor decides the task is done, it clears that mentee right away (section 8).
6. **Mentor tells the user** in plain words: which mentee ran, what it was asked, what it said, what happens next.
7. **Repeat** from step 3 until every task is done.

## 5. The task board

The mentor keeps a short list like this, and updates it after every report:

| Task | Status | Mentee | Notes |
|------|--------|--------|-------|
| 1. Set up project | done | mentee 1 | |
| 2. Login form | in progress | mentee 3 (continues mentee 2) | handoff at step 3 of 5 |
| 3. Tests | waiting | — | needs task 2 |

If the mentor's own context is getting full, this board plus the latest handoff notes are enough to pick up the work again.

## 6. Task message template

Each mentee starts with an empty memory, so the mentor's message must stand on its own:

```
You are mentee <n>.
Task: <one-line goal>
Background: <what exists already, decisions made, files that matter>
Done means: <how to tell it is finished>
Do not: <limits — files to leave alone, things out of scope>
Budget: hand off when you hit about 80% of your room (see "Handoff rules").
Report: a done report or a handoff report, in the formats below.
```

## 7. Handoff at 80% context

A long task can fill a mentee's context window. A mentee with a full context gets slow and forgets early details. So when a mentee is about **80% full**, it stops, writes down its work, and hands it to the mentor. A fresh mentee then carries on.

### How the mentee knows it is near 80%

A subagent cannot see a live "% used" number. So it uses rough signs instead. It should hand off when **any** of these is true:

- It has made about **40 tool calls** on this task.
- It has read many large files, or one very long output (big logs, big test runs).
- It notices it is losing track of earlier details.
- The mentor's task message set a smaller budget, and it has reached it.

Picking the handoff point a little early is fine. Picking it late is not.

### What the mentee does at the handoff point

1. Finish the current small step, so nothing is left half-written. If it cannot finish, undo the half-done change or clearly mark it.
2. Write a **handoff report** (format below) and return it to the mentor as its final answer.
3. Stop. Do not start anything new.

### Handoff report format

```
HANDOFF from mentee <n>
Task: <the original task, word for word>
Done so far:
  - <step> — <files changed>
Not done yet:
  - <step>
  - <step>
Current state: <does it build? do tests pass? anything half-done?>
Key facts learned: <things the next mentee must know and would not guess>
Watch out for: <traps, dead ends already tried>
Next step: <the very next thing to do>
```

### What the mentor does with a handoff

1. **Check it.** Read the report. Quickly confirm the claims (for example, the files listed really changed). If the report is unclear, ask that mentee one follow-up question before retiring it.
2. **Clear the mentee.** Follow the clearing checklist in section 8.
3. **Update the task board.**
4. **Reassign if work is left.** Spawn the next numbered mentee with a task message that contains the handoff report. Its context starts empty, holding only what it needs.
5. **Tell the user**: "`mentee 2` handed off at 80% after 3 of 5 steps. Spawned `mentee 4` to finish steps 4–5."

If nothing is left to do, the mentor just marks the task done and moves on.

## 8. Context clearing in detail

### What a mentee's context holds

A mentee's context is everything it has seen since it started: the task message, every file it read, every command output, every tool call, and its own thinking. It only grows. Big outputs (long logs, large files, full test runs) fill it fastest.

When it gets too full, three things go wrong:
- **It forgets the start.** The task message and early decisions get pushed out or blurred.
- **It gets slower and costs more.** Every new step has to carry the whole history along.
- **Old noise misleads it.** Failed attempts and stale file contents still sit there and can steer it the wrong way.

Clearing fixes all three: a new mentee starts with only the facts that still matter.

### What "clearing" means here

The mentor cannot reach into a mentee and wipe its memory. Instead, clearing a mentee means three things together:

1. **Retire it.** Mark it `retired` on the task board.
2. **Never resume it.** Do not send it more messages with `SendMessage`. Resuming would load its whole full history again, which is the opposite of clearing.
3. **Carry forward only the handoff report.** The next mentee gets the report, not the history.

The retired mentee's history is not deleted. Claude Code keeps it as a file at
`~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`
and removes it after `cleanupPeriodDays` (30 days by default). The mentor should not read that file during normal work — that would just move the clutter into the mentor's context. It is only for emergencies (see "Forced clear" below) or for the user to look at.

### What moves forward and what is left behind

| Moves forward to the next mentee | Left behind with the retired mentee |
|---|---|
| The handoff report | Raw file contents it read |
| The task board entry | Full command and test output |
| The files it changed on disk | Its step-by-step thinking |
| Facts and traps it wrote under "Key facts" / "Watch out for" | Dead ends it did **not** write down |

The last row is the important one. Anything the mentee learned but did not write in its report is lost. So the mentee must write down failed attempts too, or the next mentee will try them again.

### The three ways a mentee's context ends

1. **Done.** The task is finished. The mentor checks the done report and clears the mentee automatically (see "Automatic clear when a task is done" below). Nothing to carry forward.
2. **Handoff.** The mentee reached about 80% and wrote a handoff report. This is the normal, planned clear.
3. **Forced clear.** The mentor stops the mentee itself, because:
   - it went far past its budget and did not hand off,
   - it is going in circles (same error, same fix, again and again), or
   - it is doing work outside its task.

   The mentor stops it (with `TaskStop`, or the user can press `x` on it in `/tasks`). A stopped mentee does not resume on its own. Since there is no handoff report, the mentor writes a **recovery note** in the same format, using:
   - the task board,
   - the files on disk (what really changed), and
   - only if really needed, the end of the mentee's transcript file.

   The mentor tells the user that this was a forced clear and why.

### Automatic clear when a task is done

A mentee is cleared **every time its task is done**. This is not optional, and the mentor does not ask the user first. It is part of the normal loop.

**The mentor decides when a task is done, not the mentee.** A mentee's done report is a claim. The mentor checks it against the task's "Done means" line before clearing:

1. The mentee sends a done report.
2. The mentor checks it: the right files changed, the checks the task asked for pass, and nothing outside the task was touched.
3. Then one of these:
   - **It is done.** The mentor clears the mentee right away: it marks the mentee `retired` and the task `done` on the task board. Then it tells the user in one line, for example: "Task 2 done. `mentee 3` cleared."
   - **It is almost done** (a small fix is missing) and the mentee is well under budget. The mentor resumes it once with `SendMessage` to fix that one thing, then checks again.
   - **It is not done**, or the mentee is near its budget. The mentor writes a recovery note (section 8, "Forced clear"), clears the mentee, and gives the rest to a new mentee.

Why clear even if the mentee still has room left? Its context is full of details about the old task. Using it for a new task would mix the two, and it would carry that weight for no reason. A new mentee per task is cleaner and cheaper. That is also why the "Resume or clear?" table below says to clear for a new, unrelated task.

The only thing that keeps a done mentee from being cleared is if the user asks to keep it, for example: "keep `mentee 3` around, I want to ask it something."

### Clearing checklist (for the mentor)

Do these in order every time a mentee is cleared:

1. Read the handoff report (or write the recovery note).
2. Check its claims against the files on disk.
3. Ask any follow-up question **now**, while the mentee can still be reached. After step 4 it will not be asked again.
4. Mark the mentee `retired` on the task board.
5. Update the task's status and "Notes" column.
6. If work is left: spawn the next numbered mentee with the task message from section 6, plus the handoff report pasted **in full**. Do not re-summarise it — each summary loses detail, like a game of telephone.
7. Tell the user what happened.

### Resume or clear?

| Situation | Do this |
|---|---|
| Mentee finished, you have one small follow-up question, and it was well under budget | Resume it with `SendMessage` |
| Mentee handed off at 80% | Clear |
| Mentee is stuck or going in circles | Forced clear |
| Mentee's report was unclear, before retiring it | Resume once to ask, then clear |
| The next task is new and unrelated | Clear, start a new mentee — even if the old one has room left |

Rule of thumb: resume to **ask**, clear to **continue work**.

### Long handoff chains

If one task needs a third mentee (two handoffs), the task is too big. The mentor should stop and split the remaining work into smaller tasks on the board, then show the user the new split.

When a chain does happen, the new mentee's handoff report must **replace** the old one, not be stacked on top. It should merge in everything from the earlier report that is still true. So the next mentee always gets one current report, not a pile of old ones.

### Clearing versus auto-compaction

Claude Code also squeezes a subagent's history by itself when it gets very full ("auto-compaction"). That is not the same as a handoff:

| | Handoff and clear | Auto-compaction |
|---|---|---|
| Who decides what to keep | The mentee, on purpose | An automatic summary |
| When | About 80%, at a clean stopping point | When the window is nearly full, maybe mid-step |
| Written record | Yes, a handoff report the mentor can check | No, the mentor never sees it |
| Mentor stays in control | Yes | No |

The 80% handoff is meant to happen **before** auto-compaction would. If a mentee was auto-compacted anyway, the mentor should treat its next report with extra care: details may have been lost.

### Keeping the mentor's own context small

The mentor has a context window too, and every mentee report adds to it. Only the mentee's final report comes back to the mentor, not its tool calls — which is a big reason to use mentees at all. To keep it that way:

- Keep reports short and in the set format. No pasted logs or whole files.
- Keep the task board in a file (for example `docs/task-board.md`), not only in chat.

If the mentor itself gets full, the user can run `/clear` and start a new session. The new mentor reads the task board file and the latest handoff report and carries on. This is the same clearing idea one level up.

## 9. When things go wrong

- **A mentee fails or its result looks wrong:** the mentor explains to the user what happened before trying again. It does not silently retry.
- **Same task fails twice:** the mentor stops and asks the user how to go on.
- **A mentee asks a question:** only the mentor can ask the user. The mentee puts the question in its report, the mentor asks the user, and passes the answer to the next mentee (or to the same mentee with `SendMessage`, if it is not retired).
- **A mentee lacks a tool it needs** (for example, `planner` cannot write files): the mentor notes this to the user and gives the task to a mentee of a type that has the tool.

## 10. Things worth knowing (from the Claude Code docs)

Checked against the official subagent docs: https://code.claude.com/docs/en/sub-agents

- Each subagent starts with a **fresh, separate context window**. It does not see the main conversation. This is why task messages and handoff reports must be complete.
- The main session **cannot wipe** a subagent's context. "Clearing" in this file means: stop resuming that mentee and start a new one.
- A finished subagent **can be resumed** with `SendMessage`, and it keeps its full history. That is handy for a quick follow-up — but it is the opposite of clearing, so do not resume a mentee that has handed off.
- The docs do **not** say a subagent can see its own context-usage percentage. That is why section 7 uses rough signs instead.
- Subagents **auto-compact** (summarise their own history) when full, the same way the main session does. `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` changes when that happens. Auto-compaction keeps a mentee alive but loses detail; the handoff in section 7 is meant to happen first, on purpose, with a clean written record.
- Subagents **can spawn their own subagents** (up to three levels deep by default). In this project, mentees should **not** do that — all spawning goes through the mentor, so the user sees every agent and the numbering stays clean.
