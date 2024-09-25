import React from 'react';
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
  prefLangCookie: string;
}) {
  const [langCookie, setLangCookie] = React.useState(
    decodeURIComponent(prefLangCookie)
  );

  const includedLanguages = languages.map((lang) => lang.value).join(',');

  const googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages,
      },
      'google_translate_element'
    );
  };

  React.useEffect(() => {
    (window as any).googleTranslateElementInit = googleTranslateElementInit;
  });

  const changeLang = (value: string) => {
    const lang = '/en/' + value;
    setLangCookie(lang);
    const element = document.querySelector(
      '.goog-te-combo'
    ) as HTMLSelectElement;
    element.value = value;
    element.dispatchEvent(new Event('change'));
  };

  return (
    <div>
      <div id="google_translate_element" className="invisible h-px w-px"></div>

      <Select
        name={'lang-select'}
        className={`notranslate ${styles.langSelectContainer}`}
        options={languages}
        label={
          <div className="mr-2 flex justify-center">
            <IconWorld color="white" />
          </div>
        }
        labelInline
        value={langCookie.split('/')[2]}
        onChange={changeLang}
      />

      {/* <TransparentSelector
        onChange={changeLang}
        value={langCookie.split('/')[2]}
        label={<IconWorld color="white" size={'16px'} />}
      /> */}

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}

// const TransparentSelector = ({
//   onChange,
//   value,
//   label,
// }: {
//   onChange: any;
//   value: string;
//   label?: any | null;
// }) => {
//   return (
//     <div
//       className={`notranslate ${styles.transparentSelector}`}
//       tabIndex={0}
//       // onFocus={() => document.querySelector('select')?.focus()}
//     >
//       {label}
//       <select
//         onChange={(e) => onChange(e.target.value)}
//         value={value}
//         tabIndex={-1}
//       >
//         {languages.map((it) => (
//           <option value={it.value} key={it.value}>
//             {it.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };
