// Shared helpers for the .claude hooks and scripts. Node ports of the a4c fish
// originals; the parsing is deliberately naive (line-based, no YAML library) to
// stay dependency-free, and is only as strict as our own frontmatter schema.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function repoRoot() {
    if (process.env.CLAUDE_PROJECT_DIR) return process.env.CLAUDE_PROJECT_DIR;
    try {
        return execSync('git rev-parse --show-toplevel', { stdio: ['ignore', 'pipe', 'ignore'] })
            .toString()
            .trim();
    } catch {
        return process.cwd();
    }
}

export function readText(file) {
    return readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

export function frontmatterLines(file) {
    const lines = readText(file).split('\n');
    if (lines[0] !== '---') return [];
    const end = lines.indexOf('---', 1);
    return end === -1 ? [] : lines.slice(1, end);
}

export function fmField(file, key) {
    const prefix = `${key}:`;
    const line = frontmatterLines(file).find((l) => l.startsWith(prefix));
    return line ? line.slice(prefix.length).trim() : '';
}

// Handles both `key: [a, b]` and the block form with `  - a` lines.
export function fmList(file, key) {
    const prefix = `${key}:`;
    const items = [];
    let inList = false;
    for (const line of frontmatterLines(file)) {
        if (line.startsWith(prefix)) {
            const tail = line.slice(prefix.length).replace(/[[\]"]/g, '').trim();
            if (tail) items.push(...tail.split(','));
            inList = true;
        } else if (inList && /^\s+-\s+/.test(line)) {
            items.push(line.replace(/^\s+-\s+/, '').replace(/^"|"$/g, ''));
        } else if (inList && /^[A-Za-z]/.test(line)) {
            inList = false;
        }
    }
    return items.map((i) => i.trim().toLowerCase()).filter(Boolean);
}

export function ruleFiles(rulesDir) {
    if (!existsSync(rulesDir)) return [];
    return readdirSync(rulesDir)
        .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== '_template.md')
        .map((f) => join(rulesDir, f));
}

// Items are `## <slug>  <!-- id: b-… -->` headings followed by `**status:**` /
// `**tag:**` bullets. Code fences are skipped so the template block never counts.
export function backlogItems(backlogFile) {
    if (!existsSync(backlogFile)) return [];
    const items = [];
    let current = null;
    let inFence = false;
    for (const line of readText(backlogFile).split('\n')) {
        if (line.startsWith('```')) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        if (line.startsWith('## ')) {
            const id = line.match(/id:\s*([^\s]+?)\s*-->/)?.[1] ?? '';
            const slug = line.slice(3).replace(/\s*<!--.*$/, '');
            current = { id, slug, status: '', tag: '' };
            items.push(current);
            continue;
        }
        if (!current) continue;
        const status = line.match(/\*\*status:\*\*\s*(\S+)/);
        if (status) current.status = status[1];
        const tag = line.match(/\*\*tag:\*\*\s*(\S+)/);
        if (tag) current.tag = tag[1];
    }
    return items.filter((i) => i.id && i.slug);
}

export function phaseDirs(phasesDir) {
    if (!existsSync(phasesDir)) return [];
    return readdirSync(phasesDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => join(phasesDir, d.name))
        .filter((dir) => existsSync(join(dir, 'index.md')));
}

export async function readStdin() {
    if (process.stdin.isTTY) return '';
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
}

export function todayUtc() {
    return new Date().toISOString().slice(0, 10);
}
