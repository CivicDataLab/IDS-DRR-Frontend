'use client';

import Image from 'next/image';
import { useStateName } from '@/hooks/use-state-name';
import { Link } from '@/i18n/navigation';
import { type Module } from 'ids-drr-branding-types';
import { useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from 'opub-ui';

import { states } from '@/config/site';
import { stateQuickLink } from '@/lib/analytics/build-route';
import { getActiveModules } from '@/lib/analytics/module-config';
import { cn } from '@/lib/utils';
import styles from './analytics-quick-links.module.css';

export const QuickLinks = () => {
  const t = useTranslations('home.analytics');
  const stateName = useStateName();

  const stateLinks = states;

  return (
    <section
      className="flex h-full w-full flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20"
      aria-labelledby="home-analytics-heading"
    >
      <div className="container flex flex-col gap-4">
        <Text
          id="home-analytics-heading"
          variant="heading3xl"
          fontWeight="bold"
          color="default"
          as="h2"
        >
          {t('heading')}
        </Text>
        <Text variant="bodyLg" fontWeight="regular" color="default">
          {t('description')}
        </Text>
        <Text variant="bodyLg" fontWeight="semibold" color="default">
          {t('emptyPrompt')}
        </Text>
      </div>
      <Carousel
        aria-roledescription="carousel"
        className="flex w-full items-center justify-center gap-2 px-2 md:px-14"
        opts={{ align: 'start' }}
      >
        <div className="shrink-0 rounded-1 bg-surfaceDefault">
          <CarouselPrevious />
        </div>
        <CarouselContent
          aria-live="polite"
          className={`w-full ${
            stateLinks.length === 1 ? 'flex justify-center' : ''
          }`}
        >
          {stateLinks.map((item) => {
            const modules = item.modules ?? [];
            const multiModule = modules.length > 1;
            const activeModules = getActiveModules(item.slug);

            return (
              <CarouselItem
                key={item.slug}
                className="basis-full  md:basis-1/2 lg:basis-1/4"
              >
                {item.status === 'active' ? (
                  <Link
                    href={stateQuickLink(item.slug)}
                    className={cn(
                      'block w-full no-underline',
                      styles.stateCard
                    )}
                    aria-label={stateName(item.slug, item.name)}
                  >
                    <div
                      className={cn(
                        'flex h-40 w-full gap-4 rounded-2 bg-surfaceDefault p-4 shadow-elementCard',
                        multiModule
                          ? 'flex-row items-center md:h-40 lg:h-32'
                          : 'flex-col items-center justify-center text-center'
                      )}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        className={cn(
                          'h-20 w-20 shrink-0 object-contain',
                          styles.stateIcon
                        )}
                      />
                      <div
                        className={cn(
                          'flex min-w-0 flex-col gap-2',
                          multiModule && 'flex-1'
                        )}
                      >
                        <Text variant="headingLg" fontWeight="bold" as="h3">
                          {stateName(item.slug, item.name)}
                        </Text>
                        {activeModules.length > 0 && modules.length > 1 && (
                          <>
                            <Text variant="bodyMd" color="subdued">
                              {t('available')}
                            </Text>
                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                              {activeModules.map((module: Module) => (
                                <span
                                  key={module.slug}
                                  className="inline-flex items-center gap-1"
                                  style={
                                    module.color
                                      ? { color: module.color }
                                      : undefined
                                  }
                                >
                                  {module.icon && (
                                    <Image
                                      src={module.icon}
                                      alt=""
                                      className="h-4 w-4 shrink-0 object-contain"
                                    />
                                  )}
                                  <Text variant="bodyMd">{module.name}</Text>
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative flex h-40 w-full flex-col items-center gap-4 rounded-2 bg-surfaceSubdued p-4 shadow-elementCard">
                    <Text
                      variant="bodyMd"
                      fontWeight="semibold"
                      className="absolute left-3 top-3 rounded-2 bg-basePureBlack px-3 py-1 text-surfaceDefault"
                    >
                      {t('comingSoon')}
                    </Text>
                    <Image
                      src={item.icon}
                      alt=""
                      className={cn(
                        'h-20 w-20 shrink-0 object-contain',
                        styles.inactiveStateIcon
                      )}
                    />
                    <Text variant="headingLg" fontWeight="bold">
                      {stateName(item.slug, item.name)}
                    </Text>
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="shrink-0 rounded-1 bg-surfaceDefault">
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
};
