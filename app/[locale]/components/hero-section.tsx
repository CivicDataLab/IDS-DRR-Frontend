import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Text } from 'opub-ui';

import { heroBackground, heroForeground } from '@/config/site';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  const t = useTranslations('home.hero');
  const tSite = useTranslations('site');
  return (
    <section
      className={cn(styles.HeroSection)}
      style={heroBackground ? { backgroundImage: `url(${heroBackground})` } : undefined}
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
        {heroForeground && (
          <Image
            src={heroForeground}
            alt=""
            sizes={`(min-width: 1024px) ${heroForeground.width}px, 100vw`}
            className="block h-auto max-w-full lg:max-w-none"
          />
        )}

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
