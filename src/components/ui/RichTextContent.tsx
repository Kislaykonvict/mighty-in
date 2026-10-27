import React from 'react';

interface RichTextContentProps {
  content?: string | null;
  className?: string;
  as?: React.ElementType;
  inline?: boolean;
}

/**
 * Renders text content that may contain rich HTML markup (bold, italic, colors, links)
 * produced by the lightweight rich text editor. If no HTML tags are present,
 * it renders as standard React text to avoid unnecessary DOM overhead.
 * When `inline` is true, outer paragraph tags are stripped to prevent invalid HTML nesting.
 */
export function RichTextContent({
  content,
  className = '',
  as: Component = 'span',
  inline = false,
}: RichTextContentProps) {
  if (!content) return null;

  let processed = content;
  if (inline) {
    // Strip leading/trailing <p> and </p> tags if present
    processed = processed
      .replace(/^<p\b[^>]*>/i, '')
      .replace(/<\/p>$/i, '')
      .trim();
  }

  const hasHtml = /<[a-z][\s\S]*>/i.test(processed);

  if (hasHtml) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  }

  return <Component className={className}>{processed}</Component>;
}

export default RichTextContent;
