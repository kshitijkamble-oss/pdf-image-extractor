// Create a new arc phase folder with index.md + 6 phase stubs.
//
// Usage:
//   node .claude/scripts/arc-start.mjs <topic-slug> [<backlog-id>]
//
// Creates docs/phases/YYYY-MM-DD-<topic-slug>/ with:
//   index.md        (frontmatter: topic, started, updated, backlog, status=ideate)
//   ideate.md, brainstorm.md, prep.md, align.md, implement.md, reconcile.md (stubs)

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot, todayUtc } from '../hooks/lib.mjs';

const [topic, backlogId = ''] = process.argv.slice(2);
if (!topic) {
    console.error('usage: arc-start.mjs <topic-slug> [<backlog-id>]');
    process.exit(2);
}

const today = todayUtc();
const folder = join(repoRoot(), 'docs', 'phases', `${today}-${topic}`);
if (existsSync(folder)) {
    console.error(`error: ${folder} already exists — pick a different slug or edit in place`);
    process.exit(1);
}
mkdirSync(folder, { recursive: true });

const index = [
    '---',
    `topic: ${topic}`,
    `started: ${today}`,
    `updated: ${today}`,
    `backlog: ${backlogId}`,
    'status: ideate',
    '---',
    '',
    `# ${topic}`,
    '',
    '<one-paragraph problem statement — a stranger should be able to restate it>',
    '',
];
writeFileSync(join(folder, 'index.md'), index.join('\n'));

const phases = ['ideate', 'brainstorm', 'prep', 'align', 'implement', 'reconcile'];
for (const phase of phases) {
    const title = phase[0].toUpperCase() + phase.slice(1);
    writeFileSync(join(folder, `${phase}.md`), `# ${title} — ${topic}\n\n_(not yet entered)_\n`);
}

console.log(`Created ${folder}`);
console.log(`  index.md ${phases.map((p) => `${p}.md`).join(' ')}`);
console.log('');
console.log('Next: /arc ideate — start filling in ideate.md, then flip index.md status as you advance phases.');
