import React from 'react';
import { getPageSEO } from '@/lib/seo';
import { CustomHeadScripts } from '@/components/custom-head-scripts';

interface CustomHeadCodeProps {
  path?: string;
  rawHeadCode?: string | null;
}

/**
 * Server Component that delivers dual-layer SEO & custom head script execution:
 * 1. Server-Side: Emits raw HTML directly in SSR output so crawlers (Googlebot, schema validators)
 *    immediately parse JSON-LD schemas and meta verification tags without waiting for JS execution.
 * 2. Client-Side: CustomHeadScripts parses and evaluates <script> tags, appending them directly to
 *    document.head for live browser execution (Google Tag Manager, Meta Pixel, tracking libraries).
 */
export async function CustomHeadCode({ path, rawHeadCode }: CustomHeadCodeProps) {
  let headHtml = rawHeadCode;

  if (!headHtml && path) {
    const seo = await getPageSEO(path);
    headHtml = seo?.customHeadScripts;
  }

  if (!headHtml) {
    return null;
  }

  const cleanId = (path || 'custom').replace(/[^a-zA-Z0-9_-]/g, '-');

  return (
    <>
      {/* 1. SSR Output for Search Engine Crawlers & JSON-LD parsers */}
      <div
        id={`page-seo-head-code-${cleanId}`}
        style={{ display: 'none' }}
        dangerouslySetInnerHTML={{ __html: headHtml }}
      />
      {/* 2. Client-side evaluation and document.head injection */}
      <CustomHeadScripts scripts={headHtml} />
    </>
  );
}
