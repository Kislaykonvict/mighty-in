'use client';

import { useEffect } from 'react';

export interface CustomHeadScriptsProps {
  scripts?: string | null;
  customHeadScripts?: string | null;
}

/**
 * Client Component to inject dynamic custom header scripts, meta tags, and JSON-LD schema
 * directly into document.head with browser execution and automatic lifecycle cleanup.
 */
export function CustomHeadScripts({ scripts, customHeadScripts }: CustomHeadScriptsProps) {
  const content = (scripts !== undefined ? scripts : customHeadScripts) || '';

  useEffect(() => {
    if (!content || typeof document === 'undefined') return;

    // Clean up any previously injected elements first
    const cleanupOldElements = () => {
      const injected = document.querySelectorAll('[data-custom-head-script="true"]');
      injected.forEach((el) => el.remove());
    };

    cleanupOldElements();

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // 1. Process and execute <script> tags
      const scriptElements = Array.from(doc.querySelectorAll('script'));
      scriptElements.forEach((s) => {
        const newScript = document.createElement('script');
        newScript.setAttribute('data-custom-head-script', 'true');

        // Copy all attributes
        Array.from(s.attributes).forEach((attr) => {
          if (attr.name !== 'data-custom-head-script') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });

        // Set inline script content if any
        if (s.textContent) {
          newScript.textContent = s.textContent;
        }

        document.head.appendChild(newScript);
      });

      // 2. Process <meta>, <link>, <style>, <noscript>
      const otherTags = Array.from(doc.querySelectorAll('meta, link, style, noscript'));
      otherTags.forEach((el) => {
        const cloned = el.cloneNode(true) as HTMLElement;
        cloned.setAttribute('data-custom-head-script', 'true');
        document.head.appendChild(cloned);
      });
    } catch (err) {
      console.error('[CustomHeadScripts] Error parsing or injecting head scripts:', err);
    }

    return () => {
      // Clean up injected elements on unmount or route transition
      const injected = document.querySelectorAll('[data-custom-head-script="true"]');
      injected.forEach((el) => el.remove());
    };
  }, [content]);

  return null;
}

