export type ClassValue = string | false | null | undefined;

/**
 * Join conditional class names.
 *
 * Deliberately does not merge or de-duplicate utilities: the Bảng Hiệu
 * primitives own their styles and `className` is only an escape hatch.
 */
export function cx(...values: ClassValue[]): string {
    return values.filter(Boolean).join(' ');
}
