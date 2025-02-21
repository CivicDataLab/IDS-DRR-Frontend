'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeyDetect } from '@/hooks/use-key-detect';
import { MainConfig } from '@/types';
import { Button, Icon, IconButton, Text } from 'opub-ui';

import { handleRedirect } from '@/lib/utils';
import { Icons } from '@/components/icons';

export function MobileNav({ data }: { data: MainConfig }) {
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
          <Link href={data.homeUrl}>
            <div className="flex items-center gap-2">
              <Image
                src="/logo/IDS-Platform-Logo.png"
                width={245}
                height={24}
                alt="IDS-DRR Logo"
              />
              <div className="flex flex-col gap-1"></div>
            </div>
          </Link>

          <IconButton
            icon={open ? Icons.cross : Icons.menu}
            onClick={() => setOpen((e) => !e)}
            color="onBgDefault"
          >
            Menu
          </IconButton>
        </div>
      </header>
      {open && (
        <div
          className="fixed z-10 flex h-[95vh] w-[100vw] flex-shrink-0 flex-col items-start justify-between border-t-1 border-solid border-baseGraySlateSolid11 bg-backgroundSolidDark px-5 py-8 text-textOnBGDefault"
          style={{ zIndex: '100009' }}
        >
          <div className="flex w-full items-center gap-3 p-3 pr-5">
            {data.mainNav.length > 0 && (
              <div>
                {data.mainNav.map((link) => (
                  <ExploreLink
                    key={link.title}
                    href={link.href || ''}
                    icon={link.icon || ''}
                    text={link.title || ''}
                    onClick={toggleMenu}
                  />
                ))}
              </div>
            )}
          </div>
          <footer className="flex flex-col flex-wrap items-start gap-1 self-stretch bg-backgroundSolidDark px-5 py-4">
            <div className="flex flex-col items-center justify-center gap-4 self-center">
              <div className=" ">
                <Text variant="headingSmSpaced" color="onBgDefault">
                  <strong>
                    made with{' '}
                    <span className=" text-baseRedSolid11">&#10084; </span> in
                    india️
                  </strong>{' '}
                </Text>
                <Text
                  variant="bodySm"
                  color="onBgDefault"
                  className="mt-2 block md:mt-3"
                >
                  A DataSpace product by{' '}
                  <a
                    // size="slim"
                    className=" font text-baseIndigoSolid1 underline"
                    // kind="tertiary"
                    onClick={(event) =>
                      handleRedirect(event, 'https://civicdatalab.in/')
                    }
                  >
                    CivicDataLab
                  </a>
                </Text>
              </div>
              <div className="flex items-center">
                <Image
                  src="/logo/cdlofficiallogo.png"
                  width={64}
                  height={64}
                  alt="CivicDataLab Logo"
                  className="object-contain"
                />
                <Image
                  src="/logo/ocp.png"
                  width={164}
                  height={50}
                  alt="OCP Logo"
                  className="object-contain"
                  style={{
                    width: '164',
                    height: '50',
                  }}
                />
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

const ExploreLink = ({
  href,
  icon,
  text,
  onClick,
}: {
  href: string;
  icon: string;
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
