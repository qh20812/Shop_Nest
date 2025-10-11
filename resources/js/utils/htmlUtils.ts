/**
 * Utility functions for handling HTML content and entity decoding
 */

/**
 * Decode all HTML entities using browser's native parser
 * This handles all HTML entities including Vietnamese characters like &aacute;, &agrave;, etc.
 */
export const decodeHtmlEntities = (html: string): string => {
    if (!html) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
};

/**
 * Convert HTML to plain text with proper entity decoding
 */
export const htmlToPlainText = (html: string): string => {
    if (!html) return '';
    // Replace <br>, <p>, <li> with newline
    let text = html.replace(/<\/?(br|p|li)>/gi, '\n');
    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // Replace multiple newlines with single
    text = text.replace(/\n{2,}/g, '\n');
    // Decode ALL HTML entities using browser's native parser
    text = decodeHtmlEntities(text);
    return text.trim();
};