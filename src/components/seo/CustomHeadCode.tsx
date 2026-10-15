import React from 'react';
import { getDynamicPageSeo } from '@/lib/utils/seo';

interface CustomHeadCodeProps {
  path?: string;
  rawHeadCode?: string | null;
}

/**
 * Server Component to inject custom header scripts, meta tags, and JSON-LD schema
 * directly into the server-rendered HTML for search engine crawlers and browsers.
 */
export async function CustomHeadCode({ path, rawHeadCode }: CustomHeadCodeProps) {
  let headHtml = rawHeadCode;

  if (!headHtml && path) {
    const seo = await getDynamicPageSeo(path);
    headHtml = seo?.headCode;
  }

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
