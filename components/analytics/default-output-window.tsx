import React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Icon, Text } from 'opub-ui';

import { type Indicator } from '@/config/graphql/analaytics-queries';
import { docsLink, userManualLink } from '@/config/site';
import { getFactorIcon } from '@/lib/analytics/factor-icon';
import { cn } from '@/lib/utils';
import Icons from '@/components/icons';
import { InfoSquare } from '@/components/InfoCircle';
import { MediaRendering } from '@/components/media-rendering';
import styles from './styles.module.scss';

export function IndicatorDescriptionCard({
  description,
}: {
  description: string;
}) {
  if (!description) return null;

  return (
    <div
      className={cn(
        'box-border flex w-full flex-row items-start gap-3 self-stretch rounded-1',
        'border border-borderSubdued bg-surfaceSubdued p-3'
      )}
      role="note"
    >
      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 [&_svg]:h-full [&_svg]:w-full">
        <InfoSquare color="#222136" aria-hidden />
      </span>
      <Text
        variant="bodyMd"
        fontWeight="regular"
        className="min-w-0 flex-1 leading-[135%] text-textMedium"
      >
        {description}
      </Text>
    </div>
  );
}

export function DefaultWindow({
  indicatorDescriptions,
  onClose,
}: {
  indicatorDescriptions: Indicator[] | undefined;
  onClose?: () => void;
  chartData?: unknown[];
  indicator?: string;
  boundary?: string;
}) {
  const t = useTranslations('analytics.detail');
  const tCommon = useTranslations('common');
  const list: { title: string; slug: string; description: string }[] = [];

  if (indicatorDescriptions) {
    indicatorDescriptions.forEach((item) => {
      list.push({
        title: item?.name,
        slug: item?.slug,
        description:
          item?.short_description || item?.long_description || tCommon('na'),
      });
    });
  }

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <aside
          className={cn(
            'p-4 pr-8',
            'bg-surfaceDefault shadow-basicMd',
            'shadow-inset z-1 hidden min-w-[420px] max-w-[450px] shrink-0 md:block',
            'overflow-y-auto border-r-1 border-solid border-borderSubdued',
            styles.Overlay,
            styles.OverlayActive
          )}
        >
          {/* State-level header with only close button (no icon/title) */}
          <div className="mb-1 flex items-start justify-end ">
            <Button onClick={onClose} kind="tertiary" aria-label={t('close')}>
              <Icon source={Icons.cross} />
            </Button>
          </div>

          {/* <Divider className="mt-2" /> */}
          <AboutIndicator IndicatorData={list} />
        </aside>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        <div className="h-full bg-surfaceDefault px-4">
          {/* <RenderSidebarContent /> */}
        </div>
      </MediaRendering>
    </>
  );
}

export const AboutIndicator = ({
  IndicatorData,
}: {
  IndicatorData: { title: string; slug: string; description: string }[];
}) => {
  const t = useTranslations('analytics.about');
  const rootIndicator = IndicatorData[0];
  const childIndicators = IndicatorData.slice(1);

  return (
    <div className="mx-1 mb-5 flex flex-col">
      <Text variant="headingMd" fontWeight="bold" className="mb-5 uppercase">
        {t('heading')}
      </Text>
      {rootIndicator && (
        <div className="flex flex-row items-start gap-2">
          <div className="flex flex-col">
            <Text variant="headingMd" fontWeight="semibold">
              {rootIndicator.title}
            </Text>
            <Text color="subdued">{rootIndicator.description}</Text>
          </div>
          <div className="flex h-full items-start justify-start">
            {getFactorIcon(rootIndicator.slug)}
          </div>
        </div>
      )}
      {childIndicators.length > 0 && (
        <Text className="my-4" variant="bodyLg">
          {t('calculation', {
            name: rootIndicator?.title ?? t('overallRisk'),
          })}
        </Text>
      )}
      <div className="flex flex-col items-start gap-4 p-3">
        {childIndicators.map((indicator, index) => (
          <div
            key={indicator.slug ?? index}
            className="flex flex-row items-start gap-2"
          >
            <Text variant="headingMd" fontWeight="semibold">
              {index + 1 >= 1 && index + 1 < 10
                ? `0${index + 1}.`
                : `${index + 1}.`}
            </Text>
            <div className="flex flex-row items-start gap-4">
              <div className="flex flex-col gap-1">
                <Text variant="headingMd" fontWeight="semibold">
                  {indicator.title}
                </Text>
                <Text color="subdued">{indicator.description}</Text>
              </div>
              <div className="flex h-full items-start justify-start">
                {getFactorIcon(indicator.slug)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read the user guide CTA */}
      <div className="mt-4 flex w-full flex-col justify-end gap-4">
        {userManualLink && (
          <a
            href={userManualLink}
            target="_blank"
            className="rounded-lg flex h-12 w-full items-center justify-between gap-2 rounded-2 bg-[#F6F6F7] px-3 py-3"
          >
            <Text
              variant="bodyMd"
              fontWeight="semibold"
              className="text-[#3E7844]"
            >
              {t('userGuideLink')}
            </Text>
            <Icon source={Icons.IconArrowUpRight} className="text-[#3E7844]" />
          </a>
        )}
        {docsLink && (
          <a
            href={docsLink}
            target="_blank"
            className="rounded-lg flex h-12 w-full items-center justify-between gap-2 rounded-2 bg-[#F6F6F7] px-3 py-3"
          >
            <Text
              variant="bodyMd"
              fontWeight="semibold"
              className="text-[#3E7844]"
            >
              {t('docsLink')}
            </Text>
            <Icon source={Icons.IconArrowUpRight} className="text-[#3E7844]" />
          </a>
        )}
      </div>
    </div>
  );
};
