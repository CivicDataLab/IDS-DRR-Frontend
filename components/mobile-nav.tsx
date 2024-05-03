'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeyDetect } from '@/hooks/use-key-detect';
import { MainConfig } from '@/types';
import { Icon, IconButton, Text } from 'opub-ui';

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
      <header>
        <div className="flex items-center justify-between bg-backgroundSolidDark px-5 py-3 text-textOnBGDefault md:hidden">
          <Link href={data.homeUrl}>
            <div className="flex items-center gap-2">
              <Image
                src="/logo/IDSLogo.png"
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
        <div className="h-screen overflow-y-auto border-t-1 border-solid border-baseGraySlateSolid11 bg-backgroundSolidDark text-textOnBGDefault">
          <div className="flex items-center gap-3 p-3 pr-5">
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
