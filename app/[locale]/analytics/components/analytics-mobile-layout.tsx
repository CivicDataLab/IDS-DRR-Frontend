'use client';

import React, { useState } from 'react';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { Button, Icon, Text } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_REVENUE_MAP_DATA,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { copyCurrentURL } from '@/lib/utils';
import Icons from '@/components/icons';
import { constructRegionOptions } from '../utils/utils';
import { OutputWindowComponent } from './analytics-sidebar-layout';
import { FactorList } from './factor-list';
import { FilterComp } from './filter-component';
import { MapComponent } from './map-component';

export function AnalyticsMobileLayout({
  timePeriod,
  indicator,
  boundary,
}: {
  timePeriod: string;
  indicator: string;
  boundary: string;
}) {
  const [region, setRegion] = useQueryState(
    'region',
    parseAsArrayOf(parseAsString)
  );

  const buttons = [
    {
      icon: Icons.IconMap,
      title: 'Map',
      value: 'map',
    },
    {
      icon: Icons.IconChartBar,
      title: 'Analytics',
      value: 'analytics',
    },
    {
      icon: Icons.share,
      title: 'Share',
      value: 'share',
    },
  ];

  const [selectedView, setSelectedView] = useState('analytics');

  const mapQuery: TypedDocumentNode<any, any> =
    boundary === 'district'
      ? ANALYTICS_DISTRICT_MAP_DATA
      : ANALYTICS_REVENUE_MAP_DATA;

  const mapData = useQuery(
    [`mapQuery_${boundary}_${indicator}_${timePeriod}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        mapQuery,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriod },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const geographiesData = useQuery(
    [`geographies_data_${boundary}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: { type: boundary },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const filterOpt = (boundary: string) => {
    const regionOptions = constructRegionOptions(boundary, geographiesData);

    const filteredDistrictOptions = regionOptions?.filter((option) =>
      region?.includes(option.value)
    );

    return filteredDistrictOptions;
  };

  const RenderView = ({ selectedView }: any) => {
    switch (selectedView) {
      case 'map':
        return (
          <MapComponent
            indicator={indicator}
            regions={filterOpt(boundary)}
            mapDataloading={mapData?.isFetching}
            setRegion={setRegion}
            mapData={
              boundary === 'district'
                ? mapData?.data?.districtMapData
                : mapData?.data?.revCircleMapData
            }
          />
        );
      case 'analytics':
        return <OutputWindowComponent />;
      case 'share':
        copyCurrentURL();
        break;
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-0 bg-[#FFFF]">
      <div className="flex h-[100vh] w-full flex-grow flex-col overflow-auto overflow-y-scroll">
        <div className="flex items-center  px-4">
          <FactorList />
          <FilterComp timePeriod={timePeriod} />
        </div>
        <RenderView selectedView={selectedView} />
      </div>

      <div className="flex w-full flex-row  justify-between bg-baseIndigoSolid1 ">
        {buttons.map((button, index) => (
          <Button
            key={index}
            size="slim"
            className="basis-1/3 border-t-1 border-solid  border-borderSubdued py-4"
            kind="tertiary"
            onClick={() => setSelectedView(button.value)}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <Icon source={button.icon} size={24} />
              <Text
                variant="headingMd"
                fontWeight="medium"
                className="text-textSubdued"
              >
                {button.title}
              </Text>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}
