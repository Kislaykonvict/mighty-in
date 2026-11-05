/**
 * Converts blog content (which may be an HTML string, markdown string, or legacy array of paragraphs)
 * into a clean, normalized HTML string suitable for TipTap and frontend rendering.
 */
export function convertContentToHtml(content: any): string {
  if (!content) return '';

  if (typeof content === 'string') {
    // If it's already an HTML document/fragment
    if (
      content.trim().startsWith('<') ||
      /<\/?(p|h[1-6]|ul|ol|li|blockquote|div|span|table|img|strong|em|b|i)[^>]*>/i.test(content)
    ) {
      return content;
    }
    // If it's markdown/plain text with double newlines
    content = content.split('\n\n');
  }

  if (Array.isArray(content)) {
    const htmlBlocks: string[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        htmlBlocks.push(`<ul>${currentList.map((item) => `<li>${item}</li>`).join('')}</ul>`);
        currentList = [];
      }
    };

    content.forEach((item: any) => {
      const trimmed = typeof item === 'string' ? item.trim() : String(item).trim();
      if (!trimmed) return;

      // Bullet list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[-*]\s+/, '');
        const formatted = itemText
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        currentList.push(formatted);
        return;
      }

      flushList();

      // Heading (H2, H3, etc.)
      if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        const hText = trimmed
          .replace(/^#+\s*/, '')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        htmlBlocks.push(`<h2>${hText}</h2>`);
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        const qText = trimmed
          .replace(/^>\s*/, '')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/<b>([^*]+)<\/b>/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        htmlBlocks.push(`<blockquote><p>${qText}</p></blockquote>`);
        return;
      }

      // Standard Paragraph
      const pText = trimmed
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      htmlBlocks.push(`<p>${pText}</p>`);
    });

    flushList();
    return htmlBlocks.join('');
  }

  return String(content);
}

