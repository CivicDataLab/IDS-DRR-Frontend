// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { MainConfig } from '@/types';
// import { Text } from 'opub-ui';

// export function MainNav({ data }: { data: MainConfig }) {
//   const { district } = useParams();

//   return (
//     <header className="shadow-top-bar relative z-2 hidden bg-backgroundSolidDark px-10 py-3 text-baseIndigoSolid2 sm:py-3 md:block ">
//       <div className="flex flex-wrap items-center justify-between gap-1 sm:justify-between">
//         <Link href={data.homeUrl}>
//           <div className="flex items-center gap-4">
//             <Image src="/logo/logo-min.svg" alt="" width={24} height={24} />
//             <Text variant="headingSmSpaced" as="span" color="inherit">
//               D4D ASSAM: DISTRICT DASHBOARD
//             </Text>
//           </div>
//         </Link>

//         <Text variant="bodyLg" as="span" color="inherit">
//           {capitalizeDistrictName(district)}
//         </Text>
//       </div>
//     </header>
//   );
// }

// // function to deslug and capitalize the district name
// export function capitalizeDistrictName(district: any) {
//   return district
//     .split('-')
//     .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// }

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeyDetect } from '@/hooks/use-key-detect';
import { MainConfig } from '@/types';
import { Icon, Text } from 'opub-ui';

import { Icons } from '@/components/icons';

export function MainNav({ data }: { data: MainConfig }) {
  const { key, metaKey } = useKeyDetect();
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (key === 'k' && metaKey) {
      searchRef.current?.focus();
    }
  }, [key, metaKey]);

  return (
    <header className="shadow-top-bar relative z-2 bg-backgroundSolidDark px-6 py-3 shadow-elementTopNav sm:py-3">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-between">
        <div className="flex items-center gap-1">
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
        </div>

        {data.mainNav.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-5">
            {data.mainNav.map((link) => (
              <ExploreLink
                key={link.title}
                href={link.href || ''}
                icon={link.icon || ''}
                text={link.title || ''}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

const ExploreLink = ({
  href,
  icon,
  text,
}: {
  href: string;
  icon: string;
  text: string;
}) => {
  return (
    <Link href={href}>
      <div className="hover:bg-surfaceHovered flex gap-1 rounded-1 px-2 py-2 sm:px-3">
        {Icons[icon] && <Icon color="default" source={Icons[icon]} />}
        <Text
          variant="bodyMd"
          fontWeight="medium"
          className="text-textOnBGDefault"
        >
          {text}
        </Text>
      </div>
    </Link>
  );
};
