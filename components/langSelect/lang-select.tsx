import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { IconWorld } from '@tabler/icons-react';
import { Select } from 'opub-ui';

import styles from './styles.module.scss';

// Languages dropdown list of languages and codes for Google Translate
const languages = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'অসমীয়া', value: 'as' },
];

export function TranslateDropdown({
  prefLangCookie,
}: {
  prefLangCookie: Promise<string> | string;
}) {
  const [selectedLang, setSelectedLang] = useState('en');

  // Function to safely extract language from cookie
  const getLangFromCookie = (cookie: string) => {
    try {
      const decoded = decodeURIComponent(cookie || '/en/');
      const parts = decoded.split('/');
      return parts.length > 2 ? parts[2] : 'en';
    } catch (error) {
      return 'en';
    }
  };

  useEffect(() => {
    if (prefLangCookie instanceof Promise) {
      prefLangCookie
        .then((cookie) => setSelectedLang(getLangFromCookie(cookie)))
        .catch((err) => console.error('Failed to fetch lang cookie:', err));
    } else {
      setSelectedLang(getLangFromCookie(prefLangCookie));
    }
  }, [prefLangCookie]);

  const googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: languages.map((lang) => lang.value).join(','),
        defaultLanguage: 'en',
      },
      'google_translate_element'
    );
  };

  useEffect(() => {
    (window as any).googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const changeLang = (value: string) => {
    setSelectedLang(value); // Update state

    // Update Google Translate dropdown
    const element = document.querySelector(
      '.goog-te-combo'
    ) as HTMLSelectElement;
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div>
      <div id="google_translate_element" className="invisible h-px w-px"></div>

      <Select
        name="lang-select"
        className={`notranslate ${styles.langSelectContainer}`}
        options={languages}
        label={
          <div className="mr-2 flex justify-center">
            <IconWorld color="white" />
          </div>
        }
        labelInline
        value={selectedLang}
        onChange={changeLang}
      />

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}
