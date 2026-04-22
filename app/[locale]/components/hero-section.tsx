import Image from 'next/image';
import { Text } from 'opub-ui';

import { HeroSectionText } from '@/config/consts';
import { heroImage } from '@/config/site';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  return (
    <section
      className={cn(styles.HeroSection)}
      style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      aria-label="Hero Section showcasing IDS-DRR"
    >
      <div className=" container flex h-full w-full flex-col items-center justify-end self-center py-14">
        <Text className=" sr-only" variant="heading4xl" as="h1">
          IDS-DRR
        </Text>
        <Image
          src="/logo/IDS-yellow-new.png"
          width={741}
          height={84}
          alt="IDS-DRR logo"
          className=" hidden lg:block"
        />
        <Image
          src="/logo/IDS-yellow-new.png"
          width={360}
          height={56}
          alt="IDS-DRR expanded logo"
          style={{ width: '100%', height: 'auto' }}
          className=" block lg:hidden"
        />

        <Text
          className="pt-4 text-center text-surfaceDefault"
          fontWeight="regular"
          variant="headingMd"
        >
          {HeroSectionText}
        </Text>
      </div>
    </section>
  );
};
