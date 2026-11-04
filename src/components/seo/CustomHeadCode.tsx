import React from 'react';

interface CustomHeadCodeProps {
  path?: string;
  rawHeadCode?: string | null;
}

/**
 * Server Component to inject custom header scripts, meta tags, and JSON-LD schema
 * directly into the server-rendered HTML for search engine crawlers and browsers.
 */
export async function CustomHeadCode({ path, rawHeadCode }: CustomHeadCodeProps) {
  const headHtml = rawHeadCode;

  if (!headHtml) {
    return null;
  }

  const cleanId = (path || 'custom').replace(/[^a-zA-Z0-9_-]/g, '-');

  return (
    <div
      id={`page-seo-head-code-${cleanId}`}
      style={{ display: 'none' }}
      dangerouslySetInnerHTML={{ __html: headHtml }}
    />
  );
}
