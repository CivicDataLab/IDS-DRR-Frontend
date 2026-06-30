'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { parseDate } from '@internationalized/date';
import { useTranslations } from 'next-intl';
import type { CalendarDate, DateValue } from '@internationalized/date';
import { parseAsString, useQueryState } from 'next-usequerystate';
import {
  Button,
  Icon,
  MultiSelectYearCalendar,
  RadioGroup,
  RadioItem,
  YearCalendar,
} from 'opub-ui';

import { type State } from '@/config/graphql/analaytics-queries';
import { analyticsRouteForState } from '@/lib/analytics/build-route';
import { type AnalyticsView } from '@/lib/routes';
import { hasSubDistrictSupport } from '@/lib/analytics/module-config';
import { type JsonScalar } from '@/lib/types';
import { toISODate } from '@/lib/utils';
import Icons from '@/components/icons';
import { useAnalyticsModule } from '@/hooks/use-analytics-module';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';

export function FilterComp({
  timePeriod,
  timePeriods,
  currentSelectedState,
  districtGeographiesData,
  revenueGeographiesData,
  monthMulti = false,
  // getDistrictOptions,
}: {
  timePeriod: string;
  timePeriods: string[];
  districtGeographiesData: JsonScalar;
  revenueGeographiesData: JsonScalar;
  currentSelectedState: State | null;
  monthMulti?: boolean;
  // getDistrictOptions: any;
}) {
  const t = useTranslations('analytics.filters');
  const tCommon = useTranslations('common');
  interface Option {
    disabled?: boolean;
    value: string;
    label: string;
    type?: string;
  }
  type FilterButtonOption = {
    title: string;
    value: string;
    options?: Option[];
    type: string;
  }[];
  const router = useRouter();
  const analyticsModule = useAnalyticsModule();
  const withSubDistrictSupport = hasSubDistrictSupport(
    currentSelectedState?.slug,
    analyticsModule
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // URL parameters
  const [timePeriodParam, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [districtCode, setDistrictCode] = useQueryState('district-code');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');

  // State variables
  const [selectedState, setSelectedState] = useState('');

  const [regionSelected, setRegionSelected] = useState(districtCode || '');
  const [regionName, setRegionName] = useState(''); // New state for region name
  const [revenueSelected, setRevenueSelected] = useState(revenueCode || '');
  const [timePeriodSelected, setTimePeriodSelected] = useState(timePeriodParam);

  //filter variables
  const [filterOption, setFilterOption] = useState('state');

  useEffect(() => {
    setRegionSelected(regionSelected || '');
    setRevenueSelected(revenueSelected || '');
    setTimePeriodSelected(timePeriodParam);
    setSelectedState(selectedState);
  }, [regionSelected, revenueSelected, timePeriodParam, router, selectedState]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleApplyFilters = () => {
    setDistrictCode(regionSelected, { shallow: false });
    setRevenueCode(revenueSelected, { shallow: false });
    setTimePeriod(timePeriodSelected, { shallow: false });
    setSelectedState(selectedState);

    toggleDrawer();
  };

  const handleClearAllFilters = () => {
    setRegionSelected('');
    setSelectedState('');
    setRegionName(''); // Clear region name
    setRevenueSelected('');
    setTimePeriodSelected(timePeriod);
    setDistrictCode('', { shallow: false });
    setRevenueCode('', { shallow: false });
    setTimePeriod(timePeriod, { shallow: false });
    toggleDrawer();
  };

  const handleSelectedOption = (val: string) => {
    setFilterOption(val);
  };

  const handleDistrictChange = (value: string) => {
    setRegionSelected(value);
    const districtOptions =
      FilterOptions.find((option) => option.value === 'district')?.options ||
      [];
    // Set the region name based on the selected district code
    const selectedDistrict = districtOptions.find(
      (option: { value: string }) => option.value === value
    );
    setRegionName(selectedDistrict ? selectedDistrict.label : ''); // Set region name
  };

  const FilterOptions: FilterButtonOption = [
    // {
    //   title: 'State',
    //   value: 'state',
    //   options: statesList.map((state: any) => {
    //     return { label: state.name, value: state.slug };
    //   }),
    //   type: 'radio-button',
    // },
    {
      title: t('division.title'),
      value: 'district',
      // options: getDistrictOptions(),
      options:
        districtGeographiesData?.data?.getDistrictRevCircle?.map(
          (district: { code: string; district: string }) => ({
            label: district.district,
            value: district.code,
          })
        ) || [],
      type: 'radio-button',
    },
    ...(withSubDistrictSupport
      ? [
          {
            title: t('subdivision.title'),
            value: 'revenue-circle',
            // options: getRevenueOptions(),
            options:
              revenueGeographiesData?.data?.getDistrictRevCircle?.[
                regionName
              ]?.map((circle: { code: string; [key: string]: string }) => ({
                label: circle[currentSelectedState?.child_type ?? ''],
                value: circle.code,
              })) || [],
            type: 'radio-button',
          },
        ]
      : []),
    {
      title: t('month.title'),
      value: 'month',
      type: 'month-picker',
    },
  ];

  return (
    <>
      <Button
        className="m-0 ml-auto border-1 border-solid border-[#8C9196]"
        kind="tertiary"
        onClick={toggleDrawer}
        aria-label={tCommon('filters.trigger')}
      >
        <Icon source={Icons.filter} />
      </Button>

      <MobileFilterBox
        filterOptions={FilterOptions || []}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearAllFilters}
        open={isDrawerOpen}
        toggleDrawerCallback={toggleDrawer}
        onSelectedOption={handleSelectedOption}
      >
        <MobileFilterContent>
          <RenderOptions
            filterOptions={FilterOptions || []}
            selectedOption={filterOption}
            regionSelected={regionSelected}
            setRegionSelected={handleDistrictChange}
            revenueSelected={revenueSelected}
            setRevenueSelected={setRevenueSelected}
            timePeriodData={timePeriods}
            timePeriodSelected={timePeriodSelected}
            setTimePeriodSelected={setTimePeriodSelected}
            monthMulti={monthMulti}
          />
        </MobileFilterContent>
      </MobileFilterBox>
    </>
  );
}

const RenderOptions = ({
  filterOptions,
  selectedOption,
  regionSelected,
  setRegionSelected,
  revenueSelected,
  setRevenueSelected,
  timePeriodData,
  timePeriodSelected,
  setTimePeriodSelected,
  monthMulti = false,
}: {
  filterOptions: JsonScalar;
  selectedOption: string;
  regionSelected: string;
  setRegionSelected: (value: string) => void;
  revenueSelected: string;
  setRevenueSelected: (value: string) => void;
  timePeriodData: JsonScalar;
  timePeriodSelected: string;
  setTimePeriodSelected: (value: string) => void;
  monthMulti?: boolean;
}) => {
  const t = useTranslations('analytics.filters');
  const [selectedState, setSelectedState] = useState('');
  const router = useRouter();
  const params = useParams();
  const analyticsModule = useAnalyticsModule();
  const moduleFromPath =
    typeof params.module === 'string' ? params.module : undefined;

  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );

  const type = findSelectedValue[0]?.type;
  const value = findSelectedValue[0]?.value;
  const options = findSelectedValue[0]?.options;
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const normalizedTimePeriods: string[] = Array.isArray(timePeriodData)
    ? timePeriodData
    : (timePeriodData?.data?.getDataTimePeriods || []).map(
        (date: { value: string }) => date.value
      );

  const onRadioButtonChange = (selectedValue: string, value: string) => {
    if (value === 'state') {
      setSelectedState(selectedValue);
      // Use the latest state-scoped time period when state changes.
      const latestTimePeriod =
        normalizedTimePeriods[0] ||
        `${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
      router.push(
        analyticsRouteForState(
          selectedValue,
          moduleFromPath ?? analyticsModule,
          {
            view: view as AnalyticsView,
            timePeriod: latestTimePeriod,
          }
        )
      );
      // console.log('---Selected State ---', selectedState);
    } else if (value === 'district') {
      setRegionSelected(selectedValue); // Directly set the region
    } else if (value === 'revenue-circle' || value === 'tehsil') {
      setRevenueSelected(selectedValue);
    }
  };

  let minDate: string, maxDate: string;

  const datesArray = normalizedTimePeriods.map((date: string) => {
    const [year, month] = date.split('_');
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1));
  });
  const timestamps = datesArray.map((date: Date) => date.getTime());
  if (timestamps.length > 0) {
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    minDate = toISODate(minTimestamp);
    maxDate = toISODate(maxTimestamp);
  } else {
    const [year, month] = (timePeriodSelected || '2023_08').split('_');
    minDate = `${year}-${month}-01`;
    maxDate = `${year}-${month}-01`;
  }

  switch (type) {
    case 'radio-button':
      return (
        <RadioGroup
          onChange={(e) => onRadioButtonChange(e, value)}
          name={value}
          value={
            value === 'state'
              ? selectedState
              : value === 'district'
                ? regionSelected
                : revenueSelected
          }
        >
          {value === 'revenue-circle' && !regionSelected ? (
            <div>{t('subdivision.emptyPrompt')}</div>
          ) : (
            options.map((item: JsonScalar, idx: number) =>
              item.type === 'group' ? (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F7F7F8',
                    padding: '10px',
                    marginTop: '15px',
                  }}
                >
                  <span>{item.label}</span>
                </div>
              ) : (
                <RadioItem key={idx} value={item.value}>
                  {item.label}
                </RadioItem>
              )
            )
          )}
        </RadioGroup>
      );
    case 'month-picker':
      if (monthMulti) {
        const selectedDates: CalendarDate[] = (timePeriodSelected || '')
          .split(',')
          .filter(Boolean)
          .map((p) => {
            const [year, month] = p.split('_');
            if (!year || !month) return undefined;
            return parseDate(
              `${year}-${month.padStart(2, '0')}-01`
            ) as CalendarDate;
          })
          .filter((d): d is CalendarDate => d !== undefined);
        const periodYears = normalizedTimePeriods
          .map((p: string) => parseInt(p.split('_')[0], 10))
          .filter((y: number) => !isNaN(y));
        const yearRange =
          periodYears.length > 0
            ? {
                start: Math.min(...periodYears),
                end: Math.max(...periodYears),
              }
            : undefined;
        return (
          <div className="self-center">
            <MultiSelectYearCalendar
              value={selectedDates}
              yearRange={yearRange}
              onChange={(dates: DateValue[]) => {
                if (!dates || dates.length === 0) {
                  setTimePeriodSelected('');
                  return;
                }
                setTimePeriodSelected(
                  dates
                    .map(
                      (d) =>
                        `${d.year}_${
                          d.month < 10 ? `0${d.month}` : `${d.month}`
                        }`
                    )
                    .join(',')
                );
              }}
            />
          </div>
        );
      }
      return (
        <div className=" self-center">
          <YearCalendar
            defaultValue={parseDate(
              `${timePeriodSelected.split('_')[0]}-${timePeriodSelected.split('_')[1]}-01` ||
                '23-08-01'
            )}
            minValue={parseDate(minDate || '2023-01-04')}
            maxValue={parseDate(maxDate || '2023-01-04')}
            onChange={(date) => {
              setTimePeriodSelected(
                `${date.year}_${date.month < 10 ? `0${date.month}` : `${date.month}`}`
              );
            }}
          />
        </div>
      );
  }
};
