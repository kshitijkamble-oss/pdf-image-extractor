// UserPromptSubmit hook — injects rule bodies whose `appliesToKeywords` match
// the prompt, and emits nudges for backlog-worthy prompts and for
// implementation work with no plan behind it.
//
// Contract (checked 2026-09-29 against code.claude.com/docs/en/hooks):
//   - stdin: JSON with `prompt` (plus session_id, cwd, hook_event_name, …).
//     The a4c fish original read `user_message`, which the harness never sends.
//   - stdout: plain text is added to the model's context for this turn
//   - exit 0 = success; exit 2 = blocks the prompt (never used here)

import { join } from 'node:path';
import { fmField, fmList, phaseDirs, readStdin, readText, repoRoot, ruleFiles } from './lib.mjs';

const root = repoRoot();
const raw = await readStdin();
let prompt = '';
try {
    prompt = JSON.parse(raw).prompt ?? '';
} catch {
    prompt = raw;
}
const promptLc = prompt.toLowerCase();
const has = (phrase) => promptLc.includes(phrase);
const out = [];

// ---- 1. Rule matching ----------------------------------------------------

const matched = ruleFiles(join(root, 'docs', 'rules')).filter((f) => fmList(f, 'appliesToKeywords').some(has));
if (matched.length > 0) {
    out.push('## Rules matched by this prompt', '');
    for (const f of matched) out.push(readText(f), '', '---', '');
}

// ---- 2. Backlog capture nudge -------------------------------------------

const backlogPhrases = [
    'we should', "it'd be nice", 'would be nice', 'someday', 'eventually',
    'todo', 'fixme', 'this is broken', "there's a bug", 'regression',
    'clean this up later', 'this is hacky',
    'half-formed thought', 'thinking out loud', 'quick spike',
    'not sure how', 'open question', "haven't decided",
];
const backlogHit = backlogPhrases.find(has);
if (backlogHit) {
    out.push(
        '## Backlog nudge',
        `Prompt contains '${backlogHit}' — this may be worth \`/backlog add <tag> …\`. Suggest once, do not auto-write.`,
    );
}

// ---- 3. "Working without a plan" nudge -----------------------------------

const implPhrases = [
    'implement', 'build', 'add feature', 'add endpoint', 'add page', 'add component',
    'create feature', 'fix bug', 'fix the', 'refactor', 'migrate', 'migration',
    'ship ', 'rollout', 'integrate', 'wire up', 'hook up',
];
const trivialPhrases = ['typo', 'quick fix', 'one-line', 'one line', 'small fix', 'just a', 'trivial'];

if (implPhrases.some(has) && !trivialPhrases.some(has)) {
    const hasBacklogRef = /b-\d{8}-\d+/.test(promptLc);
    const activeArcs = phaseDirs(join(root, 'docs', 'phases')).filter((dir) => {
        const st = fmField(join(dir, 'index.md'), 'status');
        return st && st !== 'done';
    });
    if (!hasBacklogRef && activeArcs.length === 0) {
        out.push(
            '## Nudge: work without a plan?',
            'This prompt looks like implementation work, but I see **no active arc** (no `docs/phases/*/index.md` with status ≠ done) and **no backlog id** (`b-YYYYMMDD-NNN`) referenced in the prompt.',
            '',
            'Per rule **work-needs-plan** (must): consider `/backlog add` + `/arc start` before writing code. Skip only if this is a typo, one-line fix, or direct question.',
        );
    }

    const hasIssueRef = /(^|\s)#\d+\b|github\.com\/[^\s]+\/issues\/\d+/.test(promptLc);
    const ids = [...promptLc.matchAll(/b-\d{8}-\d+/g)].map((m) => m[0]);
    const backlog = ids.length > 0 ? readText(join(root, 'docs', 'backlog.md')) : '';
    const unfiled = ids.filter((id) => {
        const item = backlog.split(/^## /m).find((s) => s.includes(`id: ${id}`));
        return !item || !/\*\*gh-issue:\*\*\s*(https:\/\/|n\/a)/.test(item);
    });
    if ((!hasIssueRef && ids.length === 0 && activeArcs.length === 0) || unfiled.length > 0) {
        out.push(
            '## Nudge: no GitHub issue?',
            unfiled.length > 0
                ? `Backlog item(s) ${unfiled.join(', ')} have no \`gh-issue\` URL.`
                : 'This prompt looks like implementation work, but references **no GitHub issue** (`#123` or an issue URL) and there is no active arc.',
            '',
            'Per rule **issue-before-work** (must): file the issue with `gh issue create` and record it on the backlog item before writing code.',
        );
    }
}

if (out.length > 0) console.log(out.join('\n'));
