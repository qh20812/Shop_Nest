#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_ROOT = 'resources/js';
const ALLOWLIST_PATH = 'scripts/token-allowlist.json';
const EXTENSIONS = new Set(['.ts', '.tsx']);
const GENERATED_PREFIXES = ['resources/js/actions/', 'resources/js/routes/', 'resources/js/wayfinder/'];
const ARBITRARY_ALLOWLIST = new Set(['min-h-[100dvh]', 'max-h-[100dvh]']);

const rules = [
    {
        name: 'raw-hex',
        pattern: /#[0-9a-fA-F]{3,8}\b/g,
    },
    {
        name: 'tailwind-palette',
        pattern:
            /\b(?:bg|text|border|ring|from|to|via|fill|stroke|divide|outline|decoration|placeholder|accent|caret)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    },
    {
        name: 'named-color',
        pattern: /\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\b/g,
    },
    {
        name: 'arbitrary-value',
        pattern: /\b(?:text|bg|border|p|px|py|pt|pb|pl|pr|gap|space-x|space-y|rounded|shadow)-\[[^\]]+\]/g,
    },
    {
        name: 'legacy-shadow',
        pattern: /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/g,
    },
    {
        name: 'full-height',
        pattern: /\b(?:h-screen|min-h-screen)\b/g,
    },
    {
        name: 'backdrop-blur',
        pattern: /\bbackdrop-blur(?:-[\w-]+)?\b/g,
    },
    {
        name: 'legacy-icon',
        pattern: /\b(?:bx|bi|fa|fas|far|fab)-[\w-]+/g,
    },
];

function toPosix(value) {
    return value.split(path.sep).join('/');
}

function relativeToRoot(absolutePath) {
    return toPosix(path.relative(ROOT, absolutePath));
}

function isGenerated(relativePath) {
    return GENERATED_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
}

async function collectFiles(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await collectFiles(absolutePath)));
            continue;
        }

        if (EXTENSIONS.has(path.extname(entry.name))) {
            files.push(absolutePath);
        }
    }

    return files;
}

async function loadAllowlist() {
    try {
        const raw = await fs.readFile(path.join(ROOT, ALLOWLIST_PATH), 'utf8');
        const parsed = JSON.parse(raw);

        return new Set(Array.isArray(parsed.files) ? parsed.files : []);
    } catch (error) {
        if (error?.code === 'ENOENT') {
            return new Set();
        }

        throw error;
    }
}

async function writeAllowlist(files) {
    const sorted = [...files].sort();
    const payload = {
        description: 'Legacy files with token violations. Remove entries as pages/components are migrated. This file is deleted in Phase 6.',
        files: sorted,
    };

    await fs.mkdir(path.join(ROOT, 'scripts'), { recursive: true });
    await fs.writeFile(path.join(ROOT, ALLOWLIST_PATH), `${JSON.stringify(payload, null, 4)}\n`, 'utf8');

    return sorted.length;
}

function scanLine(line, lineNumber, file) {
    if (line.includes('token-allow')) {
        return [];
    }

    const violations = [];

    for (const rule of rules) {
        for (const match of line.matchAll(rule.pattern)) {
            const value = match[0];

            if (rule.name === 'arbitrary-value' && ARBITRARY_ALLOWLIST.has(value)) {
                continue;
            }

            violations.push({
                file,
                line: lineNumber,
                column: (match.index ?? 0) + 1,
                rule: rule.name,
                value,
            });
        }
    }

    return violations;
}

async function scanFile(file, relativePath) {
    const source = await fs.readFile(file, 'utf8');
    const lines = source.split(/\r?\n/);
    const violations = [];

    lines.forEach((line, index) => {
        violations.push(...scanLine(line, index + 1, relativePath));
    });

    return violations;
}

async function main() {
    const args = new Set(process.argv.slice(2));
    const writeBaseline = args.has('--write-baseline');
    const scanAll = args.has('--all');

    if (args.has('--help')) {
        console.log(`Usage: node scripts/check-tokens.mjs [--all] [--write-baseline]

  --all             Scan every file, ignoring the legacy allowlist.
  --write-baseline  Rewrite scripts/token-allowlist.json with current violations.
`);
        return;
    }

    const scanRoot = path.join(ROOT, SCAN_ROOT);
    const files = (await collectFiles(scanRoot)).filter((file) => !isGenerated(relativeToRoot(file)));

    if (writeBaseline) {
        const offenders = new Set();
        const violations = [];

        for (const file of files) {
            const relativePath = relativeToRoot(file);
            const fileViolations = await scanFile(file, relativePath);

            if (fileViolations.length > 0) {
                offenders.add(relativePath);
                violations.push(...fileViolations);
            }
        }

        const count = await writeAllowlist(offenders);

        console.log(`Wrote ${count} legacy file(s) to ${ALLOWLIST_PATH}.`);
        console.log(`Current violations: ${violations.length}.`);

        return;
    }

    const allowlist = scanAll ? new Set() : await loadAllowlist();
    const violations = [];
    let checked = 0;
    let skipped = 0;

    for (const file of files) {
        const relativePath = relativeToRoot(file);

        if (!scanAll && allowlist.has(relativePath)) {
            skipped += 1;
            continue;
        }

        checked += 1;
        violations.push(...(await scanFile(file, relativePath)));
    }

    if (violations.length > 0) {
        const affectedFiles = new Set(violations.map((violation) => violation.file));

        console.error(`Token check failed: ${violations.length} violation(s) across ${affectedFiles.size} file(s).`);

        for (const violation of violations) {
            console.error(`${violation.file}:${violation.line}:${violation.column} [${violation.rule}] ${violation.value}`);
        }

        console.error(
            '\nUse Nếp tokens from resources/css/tokens.css instead of raw values. Add a legacy file to scripts/token-allowlist.json only when it is scheduled for migration.',
        );
        process.exitCode = 1;
        return;
    }

    const suffix = skipped > 0 ? `, ${skipped} legacy file(s) allowlisted` : '';

    console.log(`Token check passed: ${checked} file(s) checked${suffix}.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
