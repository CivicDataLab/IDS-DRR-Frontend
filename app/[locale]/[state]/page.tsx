'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useModuleHubStats } from '@/hooks/use-module-hub-stats';
import { useStateName } from '@/hooks/use-state-name';
import { IconArrowRight, IconInfoCircle } from '@tabler/icons-react';
import type { Module } from 'ids-drr-branding-types';
import { useTranslations } from 'next-intl';
import { Tag, Text } from 'opub-ui';

import { states } from '@/config/site';
import { routes } from '@/lib/routes';
import NotFound from '../not-found';

function ModuleHubCard({
  stateSlug,
  hazardModule,
}: {
  stateSlug: string;
  hazardModule: Module;
}) {
  const t = useTranslations('analytics.stateHub');
  const tCommon = useTranslations('common');
  const { districtCount, isLoading, veryHighRiskCount } = useModuleHubStats(
    stateSlug,
    hazardModule.slug
  );

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2 bg-surfaceDefault p-8 shadow-basicMd md:flex-row ">
      <Image
        src={hazardModule.icon}
        alt=""
        className=" mx-auto h-20 w-20 shrink-0 object-contain sm:h-20 sm:w-20 md:mx-0 md:h-20 md:w-20"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Text variant="headingLg">{hazardModule.name}</Text>
        <Text variant="bodyMd" className="block min-h-[2lh]">
          {hazardModule.description || ''}
        </Text>
        {(districtCount != null || veryHighRiskCount != null) && (
          <div className="flex flex-wrap gap-2">
            {districtCount != null && districtCount > 0 && (
              <Tag variation="filled">
                {t('insightsAcrossDistricts', { count: districtCount })}
              </Tag>
            )}
            {veryHighRiskCount != null &&
              veryHighRiskCount > 0 &&
              !isLoading && (
                <Tag variation="filled" fillColor="#FFF4F4" textColor="red">
                  {t('veryHighRiskDistricts', { count: veryHighRiskCount })}
                </Tag>
              )}
            {isLoading && (
              <Tag variation="filled" fillColor="#FFF4F4" textColor="red">
                {tCommon('loading')}
              </Tag>
            )}
          </div>
        )}
        <Link
          href={routes.analytics(stateSlug, hazardModule.slug)}
          className="text-textLink flex items-center justify-end gap-2 hover:text-actionPrimaryBasicPressed"
        >
          <p>{t('explore')}</p>
          <IconArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}

export default function StatePage() {
  const params = useParams();
  const t = useTranslations('analytics.stateHub');
  const stateName = useStateName();
  const state = states.find((s) => s.slug === params.state);

  if (!state) {
    return <NotFound />;
  }

  return (
    <div className="p-10 px-4 md:px-20 ">
      <div className="flex flex-col gap-4">
        <Text variant="heading3xl" fontWeight="bold">
          {t('heading', { stateName: stateName(state.slug, state.name) })}
        </Text>
        <Text variant="bodyLg">{t('intro')}</Text>
        <Text variant="bodyLg" fontWeight="semibold">
          {t('selectDisaster')}
        </Text>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 ">
        {state.modules.map((hazardModule: Module) => {
          if (hazardModule.status === 'active') {
            return (
              <ModuleHubCard
                key={hazardModule.slug}
                stateSlug={state.slug}
                hazardModule={hazardModule}
              />
            );
          }
        })}
      </div>
      {/* <div
        className="mt-10 box-border flex w-full items-start gap-3 rounded-1 border-1 border-solid border-actionSecondaryCriticalDepressed bg-actionSecondaryCriticalDefault p-5"
        // role="alert"
      >
        <IconAlertTriangle className="h-6 w-6 shrink-0 text-iconDefault" />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <Text variant="bodyMd" fontWeight="bold" className="text-textMedium">
            Kamrup Metro
            <Text
              variant="bodyMd"
              fontWeight="regular"
              className="pl-1 text-textMedium"
            >
              was at Very High Risk of BOTH heat and floods in several months of
              2026.
            </Text>
          </Text>
          <Text variant="bodyMd" fontWeight="bold" className="text-textMedium">
            Dibrugarh
            <Text
              variant="bodyMd"
              fontWeight="regular"
              className="pl-1 text-textMedium"
            >
              is the distract ranked highest for heat risk.{' '}
            </Text>
          </Text>
          <Text variant="bodyMd" fontWeight="bold" className="text-textMedium">
            Bajali{' '}
            <Text
              variant="bodyMd"
              fontWeight="regular"
              className="pl-1 text-textMedium"
            >
              is the distract ranked highest for flood risk.
            </Text>
          </Text>
        </div>
      </div> */}
      <div
        className="mt-6 box-border flex w-full items-start gap-3 rounded-1 border-1 border-baseGreenSolid6 bg-baseGreenSolid4 p-5"
        role="note"
      >
        <IconInfoCircle className="h-6 w-6 shrink-0 text-iconDefault" />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <Text variant="bodyMd" fontWeight="bold" className="text-textMedium">
            {t('notes.districtAnalytics.label')}
            <Text
              variant="bodyMd"
              fontWeight="regular"
              className="pl-2 text-textMedium"
            >
              {t('notes.districtAnalytics.description')}
            </Text>
          </Text>

          <Text variant="bodyMd" fontWeight="bold" className="text-textMedium">
            {t('notes.heatPilot.label')}
            <Text
              variant="bodyMd"
              fontWeight="regular"
              className="pl-2 text-textMedium"
            >
              {t('notes.heatPilot.description')}
            </Text>
          </Text>
        </div>
      </div>
    </div>
  );
}
