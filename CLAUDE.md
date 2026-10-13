# Agent practice

This is a learning project. The goal is to learn how Claude Code subagents work by using them to build a small new project from scratch.

The project being built matters less than seeing how the agents work together. Keep the project small.

## How work is done here

You (the main session) are the manager. Do not write the project code yourself. Hand the work to the subagents in `.claude/agents/`:

1. `planner` turns the idea into a short, numbered task list. Show the plan to the user and wait for their OK before building.
2. `builder` builds one task at a time. Call it once per task, in order.
3. After each task, tell the user in plain words: which agent ran, what it was asked, what it reported back, and what you will do next.

If an agent fails or its result looks wrong, explain what happened before retrying.

## Mentor and mentees

Follow `docs/mentor-mentee.md` for how agents work together.

- If you are the main session, you are the **mentor**. Every subagent you spawn is a mentee named `mentee <n>`. You decide when a task is done, and then clear that mentee. A mentee near 80% of its context hands off to a fresh one. Keep the task board in `docs/task-board.md`.
- If you are a subagent, you are a **mentee**. Follow the rules and report formats in your agent file. Do not spawn other agents and do not talk to the user.

## Explain as you go

The user is learning. Point out things worth noticing, like why a task went to a certain agent, or what an agent could not do because of its tool limits.

## Later

More agents (such as `tester` and `reviewer`) may be added. Use them the same way once they exist.
