'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeyDetect } from '@/hooks/use-key-detect';
import { Credits, mainNav, PartnerLogos } from '@/config/site';
import { useTranslations } from 'next-intl';
import { IconButton, Text } from 'opub-ui';

import { routes } from '@/lib/routes';
import Icons from '@/components/icons';

export function MobileNav() {
  const t = useTranslations('nav');
  const tSite = useTranslations('site');
  const [open, setOpen] = React.useState(false);
  const toggleMenu = () => {
    setOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }

    return () => {
      document.body.style.overflow = 'initial';
    };
  }, [open]);

  const { key, metaKey } = useKeyDetect();
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (key === 'k' && metaKey) {
      searchRef.current?.focus();
    }
  }, [key, metaKey]);

  return (
    <>
      <header className="sticky top-0 z-2">
        <div className=" flex items-center justify-between bg-backgroundSolidDark px-5 py-3 text-textOnBGDefault ">
          <Link href={routes.home}>
            <div className="flex items-center gap-2">
              <Image
                src="/logo/IDS-Platform-Logo.png"
                width={245}
                height={24}
                alt={t('homeAlt', { name: tSite('name') })}
              />
              <div className="flex flex-col gap-1"></div>
            </div>
          </Link>

          <IconButton
            icon={open ? Icons.cross : Icons.menu}
            onClick={() => setOpen((e) => !e)}
            color="onBgDefault"
          >
            {t('menu')}
          </IconButton>
        </div>
      </header>
      {open && (
        <div
          className="fixed z-10 flex h-[95vh] w-[100vw] flex-shrink-0 flex-col items-start justify-between border-t-1 border-solid border-baseGraySlateSolid11 bg-backgroundSolidDark px-5 py-8 text-textOnBGDefault"
          style={{ zIndex: '100009' }}
        >
          <div className="">
            <div className="flex w-full items-center gap-3 p-3 pr-5">
              {mainNav.length > 0 && (
                <div>
                  {mainNav.map((link) => (
                    <ExploreLink
                      key={link.titleKey}
                      href={link.href || ''}
                      text={t(link.titleKey)}
                      onClick={toggleMenu}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {(Credits || PartnerLogos) && (
            <footer className="flex flex-col flex-wrap items-start gap-1 self-stretch bg-backgroundSolidDark px-5 py-4">
              <div className="flex flex-col items-center justify-center gap-4 self-center">
                {Credits && <Credits />}
                {PartnerLogos && <PartnerLogos />}
              </div>
            </footer>
          )}
        </div>
      )}
    </>
  );
}

const ExploreLink = ({
  href,
  text,
  onClick,
}: {
  href: string;
  text: string;
  onClick: () => void;
}) => {
  const handleClick = () => {
    onClick();
  };
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-6 rounded-1 px-2 py-2 sm:px-3"
        onClick={handleClick}
      >
        {/* {Icons[icon] && <Icon color="default" source={Icons[icon]} />} */}
        {/* <Icon source={Icons.diamond} color="onBgDefault" size={12} /> */}

        <Text
          variant="headingXl"
          fontWeight="medium"
          className="text-textOnBGDefault"
        >
          {text}
        </Text>
      </div>
    </Link>
  );
};
