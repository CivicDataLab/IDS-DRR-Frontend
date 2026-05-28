'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { IconWorld } from '@tabler/icons-react';
import { Select } from 'opub-ui';

import { locales } from '@/config/site';
import { usePathname, useRouter } from '@/i18n/navigation';
import styles from './styles.module.scss';

export function LocaleDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const options = React.useMemo(
    () =>
      locales.map((locale) => ({
        label:
          new Intl.DisplayNames(locale, { type: 'language' }).of(locale) ?? locale,
        value: locale,
      })),
    []
  );

  return (
    <Select
      name="locale-select"
      className={styles.langSelectContainer}
      options={options}
      label={
        <div className="mr-2 flex justify-center">
          <IconWorld color="white" />
        </div>
      }
      labelInline
      value={currentLocale}
      onChange={(value: string) =>
        router.replace(pathname, { locale: value })
      }
    />
  );
}
