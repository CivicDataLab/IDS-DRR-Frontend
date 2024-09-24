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
import { useQueryState } from 'next-usequerystate';
import { Select, Text } from 'opub-ui';

import {
  ANALYTICS_INDICATORS,
  ANALYTICS_INDICATORS_BY_CATEGORY,
} from '@/config/graphql/analaytics-queries';
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
  const districtRegion = searchParams.get('district-code') || '';
  const revenueRegion = searchParams.get('revenue-code') || '';

  const [selectedIndicator, setSelectedIndicator] = useState(indicator || '');
  const [subIndicator, setSubIndicator] = useQueryState('sub-indicator');
  const [selectedRadioValue, setSelectedRadioValue] =
    React.useState<string>('');

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

  const indicatorsQuery = useQuery(
    [`indicatorsByCategory`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  let convertedData: any = {};
  const categories = indicatorsQuery?.data?.indicatorsByCategory;

  //* To Get the Indicators in a particular format so that they can be used in URL formation check line no . 176 to 180

  /* 
    Sample on how convertedData would look 
    {
      'Damages and Losses': [
        {
          indicator: 'damages-and-losses',
          'sub-indicator': null,
        },
        {
          indicator: 'damages-and-losses',
          'sub-indicator': 'population-affected',
        },
        {
          indicator: 'damages-and-losses',
          'sub-indicator': 'crop-area-affected',
        },
      ]
    }
  */

  if (categories) {
    categories.forEach((category: { [x: string]: any }) => {
      const categoryName = Object.keys(category)[0]; // Extract the category name
      const categoryItems = category[categoryName]; // Extract the sub-items

      convertedData[categoryName] = Object.keys(categoryItems).map((key) => ({
        name: key,
        slug: categoryItems[key],
        isSubIndicator: !getIcon(categoryItems[key]),
      }));
    });
  }

  useEffect(() => {
    setSelectedIndicator(indicator || '');
  }, [indicator]);

  const handleChange = (selected: string, _name?: string) => {
    setSelectedIndicator(selected);
    // Navigate to the selected indicator
    const selectedSlug = selected;
    window.location.href = `?indicator=${selectedSlug}&time-period=${time_period}&boundary=${boundary}&district-code=${districtRegion}&revenue-code=${revenueRegion}`;
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
          {indicatorsQuery.isFetched &&
            convertedData &&
            Object.keys(convertedData).map((item) =>
              convertedData[item].map(
                (
                  ind: { name: string; slug: string; isSubIndicator: boolean },
                  index: number
                ) => {
                  const isActive = ind.slug === indicator;
                  return (
                    <React.Fragment key={`indicator_${ind.slug}_${index}`}>
                      <Link
                        href={`?indicator=${ind.slug}&time-period=${time_period}&boundary=${boundary}&district-code=${districtRegion}&revenue-code=${revenueRegion}`}
                      >
                        {!ind.isSubIndicator ? (
                          <div
                            className={cn(
                              'flex items-center gap-4  p-2',
                              isActive && 'bg-[#71E57D]'
                            )}
                          >
                            {getIcon(ind.slug)}

                            <Text>{ind.name}</Text>
                          </div>
                        ) : (
                          <div className="mt-2 px-6">
                            <RadioButton
                              changed={(value: string) => {
                                console.log('cvalue', ind.slug);
                              }}
                              isSelected={indicator === ind.slug}
                              label={ind.name}
                              value={ind.slug}
                            />
                          </div>
                        )}
                      </Link>
                    </React.Fragment>
                  );
                }
              )
            )}
        </div>
      </MediaRendering>
    </>
  );
}
