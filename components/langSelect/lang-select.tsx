'use client';

import React, { useEffect, useRef } from 'react';

import { languages } from '@/config/site';

const SCRIPT_ID = 'bhashini-translation-script';
const WIDGET_ID = 'bhashini-translation';
const SCRIPT_SRC =
  'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';

function showLanguageLabel(root: ParentNode) {
  const icon = root.querySelector('.bhashini-dropdown-btn-icon');
  if (!icon) return;

  let text = icon.querySelector<HTMLElement>('.bhashini-dropdown-btn-text');
  if (!text) {
    text = document.createElement('span');
    text.className = 'bhashini-dropdown-btn-text text-red';
    icon.appendChild(text);
  }

  const code = localStorage.getItem('preferredLanguage') || 'en';
  const label = languages.find((lang) => lang.value === code)?.label ?? code;
  if (text.textContent !== label) {
    text.textContent = label;
  }
}

export function TranslateDropdown() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const existing = document.getElementById(WIDGET_ID);
    if (existing) {
      existing.style.display = '';
      container.appendChild(existing);
    } else if (!document.getElementById(SCRIPT_ID)) {
      const langCodes = languages.map((lang) => lang.value).join(',');
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.setAttribute('page-source-language', 'en');
      script.setAttribute('translation-language-list', langCodes);
      script.setAttribute('language_order', langCodes);
      script.setAttribute('language-icon-color', '#ffffff');
      document.body.appendChild(script);
    }

    const observer = new MutationObserver(() => showLanguageLabel(container));
    observer.observe(container, { childList: true, subtree: true });
    showLanguageLabel(container);

    return () => {
      observer.disconnect();
      const widget = container.querySelector<HTMLElement>(`#${WIDGET_ID}`);
      if (widget) {
        widget.style.display = 'none';
        document.body.appendChild(widget);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bhashini-plugin-container bhashini-skip-translation"
      data-testid="bhashini-plugin-container"
    />
  );
}
