'use client';

import React, { useState } from 'react';
import { useLockBody } from '@/hooks/use-lock-body';
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
import { cn, copyCurrentURL } from '@/lib/utils';
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
  //Remove default page scroll to make only the content scrollable
  useLockBody();

  const [districtCode, setDistrictCode] = useQueryState('district-code');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');

  const buttons = [
    {
      icon: Icons.IconMap,
      title: 'Map',
      value: 'map',
    },
    {
      icon: Icons.IconChartBar,

      title: 'Insights',
      value: 'insights',
    },
    {
      icon: Icons.share,
      title: 'Share',
      value: 'share',
    },
  ];

  const [view, setView] = useQueryState(
    'view',
    parseAsString.withDefault('map')
  );
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

  const revenueMapData = useQuery(
    [`mapQuery_revenue-circle_${indicator}_${timePeriod}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_REVENUE_MAP_DATA,
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

    if (boundary === 'revenue-circle') {
      const filterRevenueCircles = regionOptions.filter(
        (option) => option.districtCode === districtCode
      );
      return filterRevenueCircles;
    }
    const filteredDistrictOptions = regionOptions?.filter(
      (option) => option.value === districtCode
    );

    return filteredDistrictOptions;
  };

  const [activeButton, setActiveButton] = useState(view);

  const RenderView = ({ selectedView }: any) => {
    switch (selectedView) {
      case 'map':
        return (
          <MapComponent
            indicator={indicator}
            regions={filterOpt(boundary)}
            setRegion={setDistrictCode}
            setRevenueRegion={setRevenueCode}
            revenueMapData={revenueMapData?.data?.revCircleMapData}
            mapDataloading={mapData?.isFetching}
            mapData={mapData?.data?.districtMapData}
          />
        );

      case 'insights':
        return (
          <div className="pt-[62px]">
            <OutputWindowComponent />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="flex h-full flex-col items-center justify-center gap-2 bg-[#FFFF]">
      <div
        className={cn(
          'relative h-[calc(100dvh_-_130px)] w-full flex-grow flex-col gap-3 overflow-y-scroll '
        )}
      >
        <div className="fixed top-[56px] z-9 flex w-full items-center bg-[#FFFF] px-4">
          <FactorList />
          <FilterComp timePeriod={timePeriod} />
        </div>

        <RenderView selectedView={view} />
      </div>

      <div className=" sticky bottom-0 flex h-[66px] w-full flex-row justify-between gap-1 bg-baseIndigoSolid1 p-1">
        {buttons.map((button, index) => (
          <Button
            key={index}
            size="slim"
            className="basis-1/3 border-t-1  py-4"
            kind="tertiary"
            onClick={() => {
              setActiveButton(button.value);
              button.value === 'share'
                ? copyCurrentURL()
                : setView(button.value, { shallow: false });
            }}
          >
            <div className="flex flex-col items-center justify-center gap-1 bg-baseIndigoSolid1 ">
              <Icon
                source={button.icon}
                size={24}
                stroke={activeButton === button.value ? 3 : 2}
              />
              <Text
                variant="headingMd"
                fontWeight={activeButton === button.value ? 'bold' : 'medium'}
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
