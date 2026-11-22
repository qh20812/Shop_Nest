#!/usr/bin/env node

/*
 * Phase 0 guardrail for the CSS refactor.
 *
 * Ratchet model:
 * - `--write-baseline` records every file that still has a violation.
 * - Normal runs skip allowlisted files and fail on anything new.
 * - Remove a file from the allowlist as soon as it is migrated.
 * - Phase 11 flips to strict and deletes the allowlist.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const JS_SCAN_ROOT = 'resources/js';
const CSS_SCAN_ROOT = 'resources/css';
const MODULE_CSS_SCAN_ROOT = 'resources/js';
const ALLOWLIST_PATH = 'scripts/token-allowlist.json';
const JS_EXTENSIONS = new Set(['.ts', '.tsx']);
const CSS_EXTENSIONS = new Set(['.css']);
const GENERATED_PREFIXES = ['resources/js/actions/', 'resources/js/routes/', 'resources/js/wayfinder/'];
const ARBITRARY_ALLOWLIST = new Set(['min-h-[100dvh]', 'max-h-[100dvh]']);
const IMPORTANT_ALLOWED = new Set(['resources/css/utilities.css', 'resources/css/base/a11y.css']);

const CLASS_HINT = /\bclassName\s*=|\b(?:cn|cx|clsx)\s*\(/;
const QUOTED_STRING = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
const VARIANT_PREFIX = /^(?:[a-z0-9-]+:|\[[^\]]+\]:)+/i;

const TAILWIND_PREFIXES = [
    'bg',
    'text',
    'border',
    'ring',
    'from',
    'to',
    'via',
    'fill',
    'stroke',
    'divide',
    'outline',
    'decoration',
    'placeholder',
    'accent',
    'caret',
    'p',
    'px',
    'py',
    'pt',
    'pb',
    'pl',
    'pr',
    'm',
    'mx',
    'my',
    'mt',
    'mb',
    'ml',
    'mr',
    'w',
    'h',
    'min-w',
    'min-h',
    'max-w',
    'max-h',
    'size',
    'basis',
    'grow',
    'shrink',
    'order',
    'gap',
    'space-x',
    'space-y',
    'grid-cols',
    'grid-rows',
    'grid-flow',
    'col',
    'row',
    'auto-cols',
    'auto-rows',
    'flex',
    'items',
    'justify',
    'self',
    'place',
    'content',
    'rounded',
    'shadow',
    'opacity',
    'z',
    'top',
    'right',
    'bottom',
    'left',
    'inset',
    'overflow',
    'overscroll',
    'scroll',
    'snap',
    'touch',
    'select',
    'pointer-events',
    'resize',
    'appearance',
    'cursor',
    'font',
    'leading',
    'tracking',
    'indent',
    'align',
    'whitespace',
    'break',
    'list',
    'line-clamp',
    'columns',
    'aspect',
    'object',
    'float',
    'clear',
    'box',
    'table',
    'transition',
    'duration',
    'ease',
    'delay',
    'animate',
    'scale',
    'rotate',
    'translate',
    'skew',
    'origin',
    'transform',
    'blur',
    'brightness',
    'contrast',
    'grayscale',
    'hue-rotate',
    'invert',
    'saturate',
    'sepia',
    'drop-shadow',
    'backdrop',
    'filter',
    'mix-blend',
    'isolation',
    'will-change',
];

const TAILWIND_STANDALONE = new Set([
    'flex',
    'grid',
    'hidden',
    'block',
    'inline',
    'inline-block',
    'inline-flex',
    'inline-grid',
    'table',
    'flow-root',
    'contents',
    'relative',
    'absolute',
    'fixed',
    'sticky',
    'static',
    'container',
    'truncate',
    'italic',
    'not-italic',
    'underline',
    'overline',
    'line-through',
    'no-underline',
    'uppercase',
    'lowercase',
    'capitalize',
    'normal-case',
    'antialiased',
    'subpixel-antialiased',
    'visible',
    'invisible',
    'collapse',
    'isolate',
    'isolation-auto',
    'transform',
    'transform-gpu',
    'transform-cpu',
    'filter',
    'blur',
    'grayscale',
    'invert',
    'sepia',
    'transition',
    'grow',
    'shrink',
    'resize',
    'resize-none',
    'resize-x',
    'resize-y',
    'appearance-none',
    'outline-none',
    'ring',
    'shadow',
    'rounded',
    'border',
    'sr-only',
    'not-sr-only',
    'group',
    'peer',
]);

const JS_RULES = [
    {
        name: 'raw-hex',
        pattern: /#[0-9a-fA-F]{3,8}\b/g,
    },
    {
        name: 'legacy-icon',
        pattern: /\b(?:bx|bi|fa[bsrl]?)-[\w-]+/g,
    },
    {
        name: 'arbitrary-value',
        pattern: /\b(?:text|bg|border|p|px|py|pt|pb|pl|pr|gap|space-x|space-y|rounded|shadow|w|h|min-w|min-h|max-w|max-h)-\[[^\]]+\]/g,
    },
];

const CSS_APPLY_RULE = {
    name: 'apply-directive',
    pattern: /@apply\b/g,
};

const CSS_IMPORTANT_RULE = {
    name: 'css-important',
    pattern: /!important\b/g,
};

const CSS_HARDCODED_COLOR_RULE = {
    name: 'css-hardcoded-color',
    pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g,
};

function toPosix(value) {
    return value.split(path.sep).join('/');
}

function relativeToRoot(absolutePath) {
    return toPosix(path.relative(ROOT, absolutePath));
}

function isGenerated(relativePath) {
    return GENERATED_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
}

function isCssColorScope(relativePath) {
    return (
        relativePath.startsWith('resources/css/components/') ||
        relativePath.startsWith('resources/css/layouts/') ||
        (relativePath.startsWith('resources/js/') && relativePath.endsWith('.css'))
    );
}

function isTailwindToken(rawToken) {
    let token = rawToken.trim();

    if (!token) {
        return false;
    }

    if (token.startsWith('sn-') || token.startsWith('styles.') || token.startsWith('$')) {
        return false;
    }

    if (ARBITRARY_ALLOWLIST.has(token)) {
        return false;
    }

    token = token.replace(/^!/, '').replace(VARIANT_PREFIX, '');

    if (token.startsWith('-')) {
        token = token.slice(1);
    }

    if (!token) {
        return false;
    }

    if (TAILWIND_STANDALONE.has(token)) {
        return true;
    }

    const candidates = [token, token.split('/')[0]];

    return candidates.some((candidate) => TAILWIND_PREFIXES.some((prefix) => candidate === prefix || candidate.startsWith(`${prefix}-`)));
}

function extractQuotedStrings(line) {
    const values = [];
    QUOTED_STRING.lastIndex = 0;

    let match;
    while ((match = QUOTED_STRING.exec(line)) !== null) {
        values.push(match[2]);
    }

    return values;
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
        description:
            'Legacy files that still contain Tailwind utilities or raw values during the CSS refactor. Remove each entry as soon as the file is migrated. This file is deleted in Phase 11.',
        files: sorted,
    };

    await fs.mkdir(path.join(ROOT, 'scripts'), { recursive: true });
    await fs.writeFile(path.join(ROOT, ALLOWLIST_PATH), `${JSON.stringify(payload, null, 4)}\n`, 'utf8');

    return sorted.length;
}

async function collectFiles(directory, extensions) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await collectFiles(absolutePath, extensions)));
            continue;
        }

        if (extensions.has(path.extname(entry.name))) {
            files.push(absolutePath);
        }
    }

    return files;
}

function pushViolation(violations, seen, violation) {
    const key = violation.value;

    if (seen.has(key)) {
        return;
    }

    seen.add(key);
    violations.push(violation);
}

function scanJsLine(line, lineNumber, file) {
    const violations = [];
    const seen = new Set();

    for (const rule of JS_RULES) {
        for (const match of line.matchAll(rule.pattern)) {
            const value = match[0];

            if (rule.name === 'arbitrary-value' && ARBITRARY_ALLOWLIST.has(value)) {
                continue;
            }

            pushViolation(violations, seen, {
                file,
                line: lineNumber,
                column: (match.index ?? 0) + 1,
                rule: rule.name,
                value,
            });
        }
    }

    if (CLASS_HINT.test(line)) {
        for (const classString of extractQuotedStrings(line)) {
            for (const token of classString.split(/\s+/)) {
                if (!isTailwindToken(token)) {
                    continue;
                }

                pushViolation(violations, seen, {
                    file,
                    line: lineNumber,
                    column: Math.max(1, line.indexOf(token) + 1),
                    rule: 'tailwind-utility',
                    value: token,
                });
            }
        }
    }

    return violations;
}

function scanCssLine(line, lineNumber, file) {
    const violations = [];
    const seen = new Set();
    const rules = [CSS_APPLY_RULE];

    if (!IMPORTANT_ALLOWED.has(file)) {
        rules.push(CSS_IMPORTANT_RULE);
    }

    if (isCssColorScope(file)) {
        rules.push(CSS_HARDCODED_COLOR_RULE);
    }

    for (const rule of rules) {
        for (const match of line.matchAll(rule.pattern)) {
            pushViolation(violations, seen, {
                file,
                line: lineNumber,
                column: (match.index ?? 0) + 1,
                rule: rule.name,
                value: match[0],
            });
        }
    }

    return violations;
}

async function scanFile(file, relativePath) {
    const source = await fs.readFile(file, 'utf8');
    const lines = source.split(/\r?\n/);
    const extension = path.extname(file);
    const violations = [];

    lines.forEach((line, index) => {
        if (JS_EXTENSIONS.has(extension)) {
            violations.push(...scanJsLine(line, index + 1, relativePath));
            return;
        }

        if (CSS_EXTENSIONS.has(extension)) {
            violations.push(...scanCssLine(line, index + 1, relativePath));
        }
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

    const jsFiles = (await collectFiles(path.join(ROOT, JS_SCAN_ROOT), JS_EXTENSIONS)).filter((file) => !isGenerated(relativeToRoot(file)));
    const cssFiles = [
        ...(await collectFiles(path.join(ROOT, CSS_SCAN_ROOT), CSS_EXTENSIONS)),
        ...(await collectFiles(path.join(ROOT, MODULE_CSS_SCAN_ROOT), CSS_EXTENSIONS)).filter((file) => !isGenerated(relativeToRoot(file))),
    ];
    const files = [...jsFiles, ...cssFiles];

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

        console.error(`CSS check failed: ${violations.length} violation(s) across ${affectedFiles.size} file(s).`);

        for (const violation of violations) {
            console.error(`${violation.file}:${violation.line}:${violation.column} [${violation.rule}] ${violation.value}`);
        }

        console.error(
            '\nUse --sn-* tokens and sn-* primitives instead of Tailwind or raw values. Never add a new file to scripts/token-allowlist.json; remove entries as files are migrated.',
        );
        process.exitCode = 1;
        return;
    }

    const suffix = skipped > 0 ? `, ${skipped} legacy file(s) allowlisted` : '';

    console.log(`CSS check passed: ${checked} file(s) checked${suffix}.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
