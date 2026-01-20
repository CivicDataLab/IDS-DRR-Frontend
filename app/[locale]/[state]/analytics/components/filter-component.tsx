'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Button, Icon, RadioGroup, RadioItem, YearCalendar } from 'opub-ui';

import { formatDate } from '@/lib/utils';
import Icons from '@/components/icons';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';

export function FilterComp({
  timePeriod,
  timePeriods,
  currentSelectedState,
  statesList,
  districtGeographiesData,
  revenueGeographiesData,
  // getDistrictOptions,
}: {
  timePeriod: string;
  timePeriods: any;
  districtGeographiesData: any;
  revenueGeographiesData: any;
  currentSelectedState: any;
  statesList: Array<any>;
  // getDistrictOptions: any;
}) {
  interface OptionType {
    label: string;
    value: string;
    type: 'group' | 'item';
    options?: OptionType[]; // Only 'group' type will have nested options
  }

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
  const routerParams = useParams();

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
      title: 'District',
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
    {
      title: 'Revenue-circle',
      value: 'revenue-circle',
      // options: getRevenueOptions(),
      options:
        revenueGeographiesData?.data?.getDistrictRevCircle?.[regionName]?.map(
          (circle: { code: string; [key: string]: string }) => ({
            label: circle[currentSelectedState.child_type],
            value: circle.code,
          })
        ) || [],
      type: 'radio-button',
    },
    {
      title: 'Month',
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
        aria-label="filter"
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
            regionOptions={
              FilterOptions.find((option) => option.value === 'district')
                ?.options || []
            }
            revenueOptions={
              FilterOptions.find((option) => option.value === 'revenue-circle')
                ?.options || []
            }
            // regionOptions={getDistrictOptions()}
            // revenueOptions={getRevenueOptions()}
            regionSelected={regionSelected}
            setRegionSelected={handleDistrictChange}
            revenueSelected={revenueSelected}
            setRevenueSelected={setRevenueSelected}
            timePeriodData={timePeriods}
            timePeriodSelected={timePeriodSelected}
            setTimePeriodSelected={setTimePeriodSelected}
          />
        </MobileFilterContent>
      </MobileFilterBox>
    </>
  );
}

export const RenderOptions = ({
  filterOptions,
  selectedOption,
  regionOptions,
  revenueOptions, // New revenue options
  regionSelected,
  setRegionSelected,
  revenueSelected,
  setRevenueSelected,
  timePeriodData,
  timePeriodSelected,
  setTimePeriodSelected,
  handleDistrictChange,
}: any) => {
  const [selectedState, setSelectedState] = useState('');
  const router = useRouter();

  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );

  const type = findSelectedValue[0]?.type;
  const value = findSelectedValue[0]?.value;
  const options = findSelectedValue[0]?.options;
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const onRadioButtonChange = (selectedValue: string, value: string) => {
    if (value === 'state') {
      setSelectedState(selectedValue);
      // Use the latest time period from the query (first item, which is the most recent)
      const latestTimePeriod =
        timePeriodData?.data?.getDataTimePeriods[0]?.value ||
        `${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
      router.push(
        `/${selectedValue}/analytics/?indicator=risk-score&time-period=${latestTimePeriod}&view=${view}`
      );
      // console.log('---Selected State ---', selectedState);
    } else if (value === 'district') {
      setRegionSelected(selectedValue); // Directly set the region
    } else if (value === 'revenue-circle' || value === 'tehsil') {
      setRevenueSelected(selectedValue);
    }
  };

  let minDate: string, maxDate: string;

  const datesArray = timePeriodData?.data?.getDataTimePeriods.map(
    (date: any) => {
      const [year, month] = date.value.split('_');
      return new Date(parseInt(year), parseInt(month));
    }
  );
  const timestamps = datesArray.map((date: any) => date.getTime());
  // Find the minimum and maximum timestamps
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  // Convert the timestamps back to dates
  minDate = formatDate(minTimestamp, true);
  maxDate = formatDate(maxTimestamp, true);

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
            <div>Please select a district</div>
          ) : (
            options.map((item: any, idx: any) =>
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
