#!/usr/bin/env node

/*
 * Strict CSS guardrail for the Bảng Hiệu design system.
 *
 * Every scanned file must pass. There is no allowlist; `--all` is kept only
 * for backwards compatibility with the old `check:css:all` script.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const JS_SCAN_ROOT = 'resources/js';
const CSS_SCAN_ROOT = 'resources/css';
const MODULE_CSS_SCAN_ROOT = 'resources/js';
const JS_EXTENSIONS = new Set(['.ts', '.tsx']);
const CSS_EXTENSIONS = new Set(['.css']);
const GENERATED_PREFIXES = ['resources/js/actions/', 'resources/js/routes/', 'resources/js/wayfinder/'];
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

    if (args.has('--help')) {
        console.log(`Usage: node scripts/check-tokens.mjs [--all]

  --all  Accepted for backwards compatibility; strict mode always scans every file.
`);
        return;
    }

    const jsFiles = (await collectFiles(path.join(ROOT, JS_SCAN_ROOT), JS_EXTENSIONS)).filter((file) => !isGenerated(relativeToRoot(file)));
    const cssFiles = [
        ...(await collectFiles(path.join(ROOT, CSS_SCAN_ROOT), CSS_EXTENSIONS)),
        ...(await collectFiles(path.join(ROOT, MODULE_CSS_SCAN_ROOT), CSS_EXTENSIONS)).filter((file) => !isGenerated(relativeToRoot(file))),
    ];
    const files = [...jsFiles, ...cssFiles];

    const violations = [];
    let checked = 0;

    for (const file of files) {
        const relativePath = relativeToRoot(file);

        checked += 1;
        violations.push(...(await scanFile(file, relativePath)));
    }

    if (violations.length > 0) {
        const affectedFiles = new Set(violations.map((violation) => violation.file));

        console.error(`CSS check failed: ${violations.length} violation(s) across ${affectedFiles.size} file(s).`);

        for (const violation of violations) {
            console.error(`${violation.file}:${violation.line}:${violation.column} [${violation.rule}] ${violation.value}`);
        }

        console.error('\nUse --sn-* tokens and sn-* primitives instead of Tailwind or raw values.');
        process.exitCode = 1;
        return;
    }

    console.log(`CSS check passed: ${checked} file(s) checked.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
