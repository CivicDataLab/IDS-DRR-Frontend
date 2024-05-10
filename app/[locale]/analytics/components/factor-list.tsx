import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/public/FactorIcons';
import InfoCircle from '@/public/InfoCircle';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'opub-ui';

import { ANALYTICS_FACTORS } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import styles from './styles.module.scss';

export function FactorList() {
  const factorData = useQuery(
    [`factors`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_FACTORS
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const time_period = searchParams.get('time-period') || '2023_08';
  const boundary = searchParams.get('boundary') || 'district';
  const region = searchParams.get('region') || '';
  const [selectedIndicator, setSelectedIndicator] = useState(indicator || '');

  const handleChange = (selected: string, _name?: string) => {
    setSelectedIndicator(selected);
    // Navigate to the selected indicator
    const selectedSlug = selected;
    window.location.href = `?indicator=${selectedSlug}&time-period=${time_period}&boundary=${boundary}&region=${region}`;
  };
  function getIcon(slug: string) {
    switch (slug) {
      case 'risk-score':
        return <RiskScore color="#000000" />;
      case 'vulnerability':
        return <Vulnerability color="#000000" />;
      case 'flood-hazard':
        return <FloodHazard color="#000000" />;
      case 'exposure':
        return <Exposure color="#000000" />;
      case 'government-response':
        return <GovtResponse color="#000000" />;
      default:
        return null;
    }
  }

  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        {factorData.isFetched && (
          <Select
            value={selectedIndicator}
            onChange={handleChange}
            label=""
            className="w-[276px]  p-2"
            name="boundary-select"
            labelInline
            options={
              factorData.data?.getFactors.map((item: any) => ({
                label: (
                  <>
                    <div className=" flex flex-row items-center gap-4 pl-2">
                      {getIcon(item.slug)} {item.name}
                    </div>
                  </>
                ),
                value: item.slug,
              })) || []
            }
          />
        )}
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <div
          className={cn(
            'absolute left-2 top-[140px] z-10 flex flex-col gap-3',
            styles.FactorList
          )}
        >
          {factorData.isFetched &&
            factorData.data?.getFactors.map((item: any, index: number) => {
              const isActive = item.slug === indicator;

              const IconMap: { [key: string]: React.ReactNode } = {
                'risk-score': (
                  <RiskScore color={isActive ? '#71E57D' : '#E2E2E2'} />
                ),
                vulnerability: (
                  <Vulnerability color={isActive ? '#71E57D' : '#E2E2E2'} />
                ),
                'flood-hazard': (
                  <FloodHazard color={isActive ? '#71E57D' : '#E2E2E2'} />
                ),
                exposure: <Exposure color={isActive ? '#71E57D' : '#E2E2E2'} />,

                'government-response': (
                  <GovtResponse color={isActive ? '#71E57D' : '#E2E2E2'} />
                ),
              };
              return (
                <Link
                  key={`indicator_${index}`}
                  href={`?indicator=${item.slug}&time-period=${time_period}&boundary=${boundary}&region=${region}`}
                >
                  <div
                    className={cn(
                      styles.IndicatorBtn,
                      'group border-2 border-solid border-baseGraySlateSolid12 bg-[#050C17CC]',
                      isActive && 'border-[#71E57D]'
                    )}
                  >
                    {IconMap[item?.slug] || (
                      <RiskScore color={isActive ? '#71E57D' : '#E2E2E2'} />
                    )}
                    <span
                      className={cn(
                        styles.IndicatorBtnText,
                        'text-[#E2E2E2] group-hover:max-w-[350px]',
                        isActive && 'text-[#71E57D]'
                      )}
                    >
                      &nbsp;
                      {item.name}
                      &nbsp;
                      {/* <InfoCircle color={isActive ? '#71E57D' : '#E2E2E2'} /> */}
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      </MediaRendering>
    </>
  );
}
