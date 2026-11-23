import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cx } from '@/lib/cx';

import styles from './markdown.module.css';

type MarkdownTextProps = {
    text: string;
    className?: string;
};

/**
 * Render assistant replies that contain markdown (bold, lists, links, code…).
 * Raw HTML is never rendered: react-markdown drops it unless `rehype-raw` is added.
 */
const components: Components = {
    a: ({ children, ...props }) => (
        <a {...props} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {children}
        </a>
    ),
    table: ({ children, ...props }) => (
        <div className={styles.tableWrap}>
            <table {...props}>{children}</table>
        </div>
    ),
};

export function MarkdownText({ text, className }: MarkdownTextProps) {
    return (
        <div className={cx(styles.markdown, className)}>
            <Markdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
                {text}
            </Markdown>
        </div>
    );
}

export type { MarkdownTextProps };
export default MarkdownText;
