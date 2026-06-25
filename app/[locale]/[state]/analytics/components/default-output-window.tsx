import React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Icon, Text } from 'opub-ui';

import { type Indicator } from '@/config/graphql/analaytics-queries';
import { docsLink, userManualLink } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  Ellipse,
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import styles from './styles.module.scss';

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
    indicatorDescriptions.forEach(
      (item) => {
        list.push({
          title: item?.name,
          slug: item?.slug,
          description:
            item?.short_description || item?.long_description || tCommon('na'),
        });
      }
    );
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
  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={'#000000'} />,
    vulnerability: <Vulnerability color={'#000000'} />,
    'flood-hazard': <FloodHazard color={'#000000'} />,
    exposure: <Exposure color={'#000000'} />,
    'government-response': <GovtResponse color={'#000000'} />,
  };
  return (
    <div className="mx-1 mb-5 flex flex-col">
      <Text variant="headingMd" fontWeight="bold" className="mb-5 uppercase">
        {t('heading')}
      </Text>
      <div className="flex flex-row items-start gap-2">
        <div className="flex flex-col">
          <Text variant="headingMd" fontWeight="semibold">
            {t('overallRisk')}
          </Text>
          <Text color="subdued">{t('description')}</Text>
        </div>
        <div className="flex h-full items-start justify-start">
          <Icon
            source={Icons.IconSwimming}
            // color={'default'}
            stroke={2}
            size={28}
            className="text-[#000]"
          />
        </div>
      </div>
      {IndicatorData.length > 1 && (
        <Text className="my-4" variant="bodyLg">
          {t('calculation')}
        </Text>
      )}
      <div className="flex flex-col items-start gap-4 p-3">
        {IndicatorData.slice(1)?.map((indicator, index) => (
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
                {IconMap[indicator.slug] || <Ellipse color="#000000" />}
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
