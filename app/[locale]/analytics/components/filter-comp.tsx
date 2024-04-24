import { text } from 'stream/consumers';
import React, { useState } from 'react';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Icon,
  IconButton,
  RadioGroup,
  RadioItem,
  Text,
} from 'opub-ui';

import {
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import Icons from '@/components/icons';

export function FilterComp({
  timePeriod,
  indicator,
}: {
  timePeriod: string;
  indicator: string;
}) {
  interface Option {
    disabled?: boolean;
    value: string;
    label: string;
    type?: string;
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [boundary, setBoundary] = useQueryState(
    'boundary',
    parseAsString.withDefault('district')
  );

  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [region, setRegion] = useQueryState(
    'region',
    parseAsArrayOf(parseAsString)
  );

  const [selectedGroup, setSelectedGroup] = React.useState<string[]>([]);
  const mapQuery: TypedDocumentNode<any, any> =
    boundary === 'district'
      ? ANALYTICS_DISTRICT_MAP_DATA
      : ANALYTICS_REVENUE_MAP_DATA;

  const mapData = useQuery(
    [`mapQuery_${boundary}_${indicator}_${timePeriodSelected}`],
    () =>
      GraphQL('analytics', mapQuery, {
        indcFilter: { slug: indicator },
        dataFilter: { dataPeriod: timePeriodSelected },
      }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const geographiesData = useQuery(
    [`geographies_data_${boundary}`],
    () =>
      GraphQL('analytics', ANALYTICS_GEOGRAPHY_DATA, {
        geoFilter: { type: boundary },
      }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const timePeriods = useQuery(
    [`timePeriods`],
    () => GraphQL('analytics', ANALYTICS_TIME_PERIODS),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  let RevCircleDropdownOptions: Option[] = [];
  let DistrictDropDownOption: Option[] = [];
  if (geographiesData.data && !geographiesData.isFetching) {
    if (boundary === 'revenue-circle') {
      let rawData = geographiesData?.data?.getDistrictRevCircle;
      if (rawData) {
        for (const district in rawData) {
          const revenueCircles = rawData[district];
          revenueCircles.forEach(
            (circle: { 'revenue-circle': string; code: string }) => {
              RevCircleDropdownOptions.push({
                label: circle['revenue-circle'],
                value: circle.code,
                type: district,
              });
            }
          );
        }
      }
    } else {
      geographiesData.data?.getDistrictRevCircle?.forEach(
        (geography: { district: string; code: string }) => {
          DistrictDropDownOption.push({
            label: geography.district,
            value: geography.code ? geography.code : 'NA',
          });
        }
      );
    }
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  function boundarySelection() {
    return (
      <>
        <RadioGroup
          onChange={(e) => {
            setBoundary(e, { shallow: false });
            setRegion([]);
            setSelectedGroup([]);
          }}
          name="District"
          defaultValue="district"
        >
          <RadioItem value="district">District</RadioItem>
          <RadioItem value="revenue-circle">Revenue Circle</RadioItem>
        </RadioGroup>
      </>
    );
  }

  function onRegionChange(selectedOptions: any) {
    const val = selectedOptions.map((option: any) => option.value);

    const group = selectedOptions.map((option: any) => option?.type ?? '');

    setSelectedGroup(group);
    setRegion(val);
  }

  const getDistrictOptions = () => {
    const updatedDistrictDropDownOption = DistrictDropDownOption.map(
      (item: any) => {
        if (region?.length === 4 && boundary === 'district') {
          return { ...item, disabled: true };
        }

        return item;
      }
    );
    return updatedDistrictDropDownOption;
  };

  function RegionSelection() {
    const options =
      boundary === 'revenue-circle'
        ? RevCircleDropdownOptions
        : getDistrictOptions();

    console.log('OPTION^^^^^^', options);
    return (
      <text>HII</text>
      // <>
      //   <RadioGroup
      //     onChange={(selectedOption) => {
      //       onRegionChange(selectedOption);
      //     }}
      //     name="Region"
      //     defaultValue=""
      //     className="overflow overflow-y-scroll"
      //   >
      //     {options.map((option, index) => (
      //       <RadioItem key={index} value={option}>
      //         {option.label}
      //       </RadioItem>
      //     ))}
      //   </RadioGroup>
      // </>
    );
  }

  type Opt = 'boundaries' | 'region' | 'month';
  const [selectedOption, setSelectedOption] = useState<Opt | null>(null);

  const renderSelection = () => {
    switch (selectedOption) {
      case 'boundaries':
        return boundarySelection();
      case 'region':
        //render search also: CORRECTION
        return RegionSelection();
      // case 'month':
      // return <MonthSelection />; /
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        className="border-1 border-solid border-[#8C9196]"
        kind="tertiary"
        onClick={toggleDrawer}
      >
        <Icon source={Icons.filter} />
      </Button>

      <Drawer open={isDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className=" h-[56px] border-b-1 border-solid border-[#C9CCCF]">
            <DrawerTitle className="flex flex-row justify-between ">
              <Text variant="headingMd">Options</Text>
              <IconButton
                icon={Icons.cross}
                onClick={toggleDrawer}
                color="default"
              >
                Menu
              </IconButton>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="flex flex-row">
            <div className="g-8 flex w-[108px] flex-col items-start self-stretch border-r-1 border-solid border-[#BDBDBD] px-2 py-4 ">
              <Button
                className=" bg-[#ffffff]  text-textDefault"
                size="slim"
                // onClick={() => boundarySelection()}
                onClick={() => setSelectedOption('boundaries')}
              >
                Boundary
              </Button>
              <Button
                className=" bg-[#ffffff]  text-textDefault"
                size="slim"
                onClick={() => setSelectedOption('region')}
              >
                Region
              </Button>
              <Button
                className=" bg-[#ffffff]  text-textDefault"
                size="slim"
                // onClick={() => monthSelection()}
                onClick={() => setSelectedOption('month')}
              >
                Month
              </Button>
            </div>
            <div className="flex w-[108px] flex-row gap-1 overflow-y-scroll py-4 pl-3">
              {renderSelection()}
            </div>
          </DrawerDescription>
          <DrawerFooter className="flex flex-row justify-between border-t-1 border-solid border-[#BDBDBD]">
            <Button
              className=" border-1 border-[#71E57D] bg-[#ffffff]"
              size="large"
            >
              <Text variant="bodyLg" fontWeight="bold" color="default">
                Clear All
              </Text>
            </Button>
            <DrawerClose
              onClick={toggleDrawer}
              className="border-[#71E57D] bg-[#71E57D]"
            >
              <Button className=" bg-[#71E57D]" size="large">
                <Text variant="bodyLg" fontWeight="bold" color="default">
                  Apply
                </Text>
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
