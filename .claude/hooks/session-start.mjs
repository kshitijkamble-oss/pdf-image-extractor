// SessionStart hook — emits the "always-on" context slice:
//   1) titles + ids of every rule with `priority: must`
//   2) TOC of open backlog items (id + slug only)
//
// Bodies of rules are NEVER emitted here — those load on match in
// user-prompt-submit.mjs. Keep this file cheap.

import { join } from 'node:path';
import { backlogItems, fmField, repoRoot, ruleFiles } from './lib.mjs';

const root = repoRoot();
const out = ['## Rules (must-priority, titles only)'];

const mustRules = ruleFiles(join(root, 'docs', 'rules')).filter((f) => fmField(f, 'priority') === 'must');
if (mustRules.length === 0) out.push('_(no must-priority rules yet)_');
for (const f of mustRules) out.push(`- **${fmField(f, 'id')}** — ${fmField(f, 'title')}`);

const open = backlogItems(join(root, 'docs', 'backlog.md')).filter((i) => i.status === 'open');
out.push('', '## Backlog (open items)');
if (open.length === 0) out.push('_(none)_');
for (const i of open) out.push(`- ${i.id} — ${i.slug}`);

console.log(out.join('\n'));
