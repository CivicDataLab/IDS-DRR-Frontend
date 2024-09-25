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
import { Button, Icon, IconButton, Menu, Select, Text, Tooltip } from 'opub-ui';

import { GithubRepoLink } from '@/config/consts';
import {
  ANALYTICS_INDICATORS,
  ANALYTICS_INDICATORS_BY_CATEGORY,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn, copyCurrentURL, handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
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

  const currentURL = typeof window !== 'undefined' ? window.location.href : '';

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
        slug: categoryItems[key]['slug'],
        description: categoryItems[key]['description'],
        isSubIndicator: !getIcon(categoryItems[key]['slug']),
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
                  ind: {
                    name: string;
                    slug: string;
                    description: string;
                    isSubIndicator: boolean;
                  },
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
                              isActive && 'bg-[#96e79eb2]'
                            )}
                          >
                            {getIcon(ind.slug)}
                            <Tooltip content={ind.description}>
                              <Text>{ind.name}</Text>
                            </Tooltip>
                          </div>
                        ) : (
                          <div className="mt-2 px-6">
                            <Tooltip content={ind.description}>
                              <RadioButton
                                isSelected={indicator === ind.slug}
                                label={ind.name}
                                value={ind.slug}
                              />
                            </Tooltip>
                          </div>
                        )}
                      </Link>
                    </React.Fragment>
                  );
                }
              )
            )}
          <hr className="m-6" />
          <div className="flex flex-col gap-4 px-6">
            <Text className="text-textSubdued" fontWeight="bold">
              ACTIONS
            </Text>{' '}
            <Menu
              trigger={
                <Button
                  className="self-start"
                  monochrome={true}
                  kind="tertiary"
                >
                  <div className="flex items-center gap-1">
                    <Icon source={Icons.share} />
                    <Text variant="bodyMd">Share</Text>
                  </div>
                </Button>
              }
              items={[
                {
                  content: 'Facebook',
                  icon: Icons.IconBrandFacebook,

                  onAction: () => {
                    const confirmation = window.confirm(
                      `You are being redirected to "${`https://www.facebook.com/sharer/sharer.php?u=${currentURL}/`}". `
                    );
                    if (confirmation) {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${currentURL}/`,
                        '_blank'
                      );
                    }
                  },
                },
                {
                  content: 'LinkedIn',
                  icon: Icons.IconBrandLinkedin,
                  onAction: () => {
                    const confirmation = window.confirm(
                      `You are being redirected to "${`https://www.linkedin.com/feed/?shareActive=true&text=${currentURL}`}`
                    );
                    if (confirmation) {
                      window.open(
                        `https://www.linkedin.com/feed/?shareActive=true&text=${currentURL}`,
                        '_blank'
                      );
                    }
                  },
                },
                {
                  content: 'Twitter',
                  icon: Icons.IconBrandX,
                  onAction: () => {
                    const confirmation = window.confirm(
                      `You are being redirected to "${`https://twitter.com/intent/tweet?url=${currentURL}/`}". `
                    );
                    if (confirmation) {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${currentURL}/`,
                        '_blank'
                      );
                    }
                  },
                },
                {
                  content: 'Copy Link',
                  icon: Icons.link,
                  onAction: () => copyCurrentURL(),
                },
              ]}
            />
            <Button
              className="self-start"
              onClick={(event) =>
                handleRedirect(
                  event,
                  'https://github.com/CivicDataLab/flood-data-ecosystem-Assam/raw/refs/heads/main/Sources/FRIMS/data/raw_data/FRIMS_Inf_Damage_Data_21_july_2023.xlsx'
                )
              }
              monochrome={true}
              kind="tertiary"
            >
              <div className="flex items-center gap-1">
                <Icon source={Icons.download} />
                <Text variant="bodyMd">Download Report</Text>
              </div>
            </Button>
          </div>
        </div>
      </MediaRendering>
    </>
  );
}
