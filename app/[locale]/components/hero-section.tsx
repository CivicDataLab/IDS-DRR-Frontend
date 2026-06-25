import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Divider, Text } from 'opub-ui';

import { heroBackground, heroForeground } from '@/config/site';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  const t = useTranslations('home.hero');
  const tSite = useTranslations('site');
  return (
    <section
      className={cn(styles.HeroSection)}
      style={
        heroBackground
          ? { backgroundImage: `url(${heroBackground})` }
          : undefined
      }
      aria-labelledby="hero-heading"
    >
      <div className=" container flex h-full w-full flex-col items-center justify-end self-center py-10">
        <Text
          id="hero-heading"
          className=" sr-only"
          variant="heading4xl"
          as="h1"
        >
          {tSite('name')}
        </Text>
        {heroForeground && (
          <div className="mb-4 flex w-fit max-w-full flex-col items-stretch gap-10">
            <Image
              src={heroForeground}
              alt=""
              sizes={`(min-width: 1024px) ${heroForeground.width}px, 100vw`}
              className="lg:max-w-90 block h-auto w-full max-w-full object-contain lg:h-40 lg:w-auto"
            />
            <Divider className="h-1 w-full" />
          </div>
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
