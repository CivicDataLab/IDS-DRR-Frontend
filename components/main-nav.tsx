'use client';

import React from 'react';
import Image from 'next/image';
import { useKeyDetect } from '@/hooks/use-key-detect';
import { useTranslations } from 'next-intl';
import { Text } from 'opub-ui';

import { languages, locales, logo, mainNav } from '@/config/site';
import { routes } from '@/lib/routes';
import { TranslateDropdown } from './langSelect/lang-select';
import { LocaleDropdown } from './langSelect/locale-select';
import NavLink from './nav-link';

export function MainNav() {
  const t = useTranslations('nav');
  const tSite = useTranslations('site');
  const { key, metaKey } = useKeyDetect();
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (key === 'k' && metaKey) {
      searchRef.current?.focus();
    }
  }, [key, metaKey]);

  return (
    <header className="shadow-top-bar z-[100000] bg-backgroundSolidDark px-6 py-3 shadow-elementTopNav sm:py-3">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-between">
        <div className="flex items-center gap-1">
          <NavLink href={routes.home}>
            <div className="flex items-center gap-2">
              {logo && (
                <Image
                  src={logo}
                  alt={t('homeAlt', { name: tSite('name') })}
                  priority
                  className="bhashini-skip-translation h-6 w-auto"
                />
              )}
              <div className="flex flex-col gap-1"></div>
            </div>
          </NavLink>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          {mainNav.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-5">
              {mainNav.map((link) => (
                <ExploreLink
                  key={link.key}
                  href={link.href || ''}
                  text={t(`links.${link.key}`)}
                />
              ))}
            </div>
          )}

          {languages.length > 0 ? (
            <TranslateDropdown />
          ) : locales.length > 1 ? (
            <LocaleDropdown />
          ) : null}
        </div>
      </div>
    </header>
  );
}

const ExploreLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <NavLink href={href} className="no-underline">
      <div className="hover:bg-surfaceHovered flex gap-1 rounded-1 px-2 py-2 sm:px-3">
        <Text
          variant="bodyMd"
          fontWeight="medium"
          className="text-textOnBGDefault"
        >
          {text}
        </Text>
      </div>
    </NavLink>
  );
};
