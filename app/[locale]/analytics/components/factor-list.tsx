import React, { useEffect, useState } from 'react';
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
import { Select, Text } from 'opub-ui';

import { ANALYTICS_INDICATORS } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import RadioButton from './RadioButton';
import styles from './styles.module.scss';

export function FactorList() {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const time_period = searchParams.get('time-period');
  const boundary = searchParams.get('boundary') || 'district';
  const region = searchParams.get('region') || '';
  const [selectedIndicator, setSelectedIndicator] = useState(indicator || '');

  const factorData = useQuery(
    [`indicators_risk-score`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: 'risk-score' },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    setSelectedIndicator(indicator || '');
  }, [indicator]);

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
              factorData.data?.indicators.map((item: any) => ({
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
        <div className={cn(styles.FactorList)}>
          {factorData.isFetched &&
            factorData.data?.indicators.map((item: any, index: number) => {
              const isActive = item.slug === indicator;

              return (
                <>
                  <Link
                    key={`indicator_${index}`}
                    href={`?indicator=${item.slug}&time-period=${time_period}&boundary=${boundary}&region=${region}`}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-4  p-2',
                        isActive && 'bg-[#71E57D]'
                      )}
                    >
                      {getIcon(item.slug)}
                      <Text>{item.name}</Text>
                    </div>
                  </Link>
                  <div className="mt-2 px-6">
                    <RadioButton
                      changed={() => {}}
                      id="radio-btn"
                      isSelected={false}
                      label="Should be integrated"
                      value="Should be integrated"
                    />
                  </div>
                </>
              );
            })}
        </div>
      </MediaRendering>
    </>
  );
}
