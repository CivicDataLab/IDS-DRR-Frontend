import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Text } from 'opub-ui';

import { heroImage } from '@/config/site';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  const t = useTranslations('home.hero');
  const tSite = useTranslations('site');
  return (
    <section
      className={cn(styles.HeroSection)}
      style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      aria-labelledby="hero-heading"
    >
      <div className=" container flex h-full w-full flex-col items-center justify-end self-center py-14">
        <Text
          id="hero-heading"
          className=" sr-only"
          variant="heading4xl"
          as="h1"
        >
          {tSite('name')}
        </Text>
        <Image
          src="/logo/IDS-yellow-new.png"
          width={741}
          height={84}
          alt=""
          className=" hidden lg:block"
        />
        <Image
          src="/logo/IDS-yellow-new.png"
          width={360}
          height={56}
          alt=""
          style={{ width: '100%', height: 'auto' }}
          className=" block lg:hidden"
        />

        <Text
          className="pt-4 text-center text-surfaceDefault"
          fontWeight="regular"
          variant="headingMd"
        >
          {t('tagline')}
        </Text>
      </div>
    </section>
  );
};
