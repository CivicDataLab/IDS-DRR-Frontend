import React, { useState } from 'react';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
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
  MonthPicker,
  RadioGroup,
  RadioItem,
  Text,
  TextField,
} from 'opub-ui';

import {
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
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

  const [selectedOption, setSelectedOption] = useState('boundary');

  const [regionOptions, setRegionOptions] = useState<Option[] | never[]>([]);

  const [boundary, setBoundary] = useQueryState(
    'boundary',
    parseAsString.withDefault('district')
  );

  const [, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [region, setRegion] = useQueryState('region');

  const [boundarySelected, setBoundarySelected] = useState(boundary);

  const [regionSelected, setRegionSelected] = useState('');

  const [timePeriodSelected, setTimePeriodSelected] = useState(timePeriod);

  const geographiesData = useQuery(
    [`geographies_data_${boundarySelected}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: { type: boundarySelected },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const timePeriods = useQuery(
    [`timePeriods`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const getRegionOptions = React.useCallback(() => {
    let RevCircleDropdownOptions: Option[] = [];
    let DistrictDropDownOption: Option[] = [];
    if (boundarySelected === 'revenue-circle') {
      let rawData = geographiesData?.data?.getDistrictRevCircle;
      if (rawData) {
        for (const district in rawData) {
          const revenueCircles = rawData[district];
          revenueCircles.forEach(
            (circle: { 'revenue-circle': string; code: string }) => {
              RevCircleDropdownOptions.push({
                label: circle['revenue-circle'],
                value: circle.code,
              });
            }
          );
        }
      }
      return RevCircleDropdownOptions;
    }
    geographiesData.data?.getDistrictRevCircle?.forEach(
      (geography: { district: string; code: string }) => {
        DistrictDropDownOption.push({
          label: geography.district,
          value: geography.code ? geography.code : 'NA',
        });
      }
    );
    return DistrictDropDownOption;
  }, [geographiesData.data?.getDistrictRevCircle, boundarySelected]);

  React.useEffect(() => {
    if (geographiesData.data) {
      const regionOptions = getRegionOptions();
      setRegionOptions(regionOptions);
    }
  }, [geographiesData.data, getRegionOptions, boundarySelected]);

  const FilterOptions = [
    {
      title: 'Boundary',
      value: 'boundary',
      options: [
        { label: 'District', value: 'district' },
        { label: 'Revenue Circle', value: 'revenue-circle' },
      ],
      type: 'radio-button',
    },
    {
      title: 'Region',
      value: 'region',
      options: regionOptions,
      type: 'radio-button',
    },
    {
      title: 'Month',
      value: 'month',
      type: 'month-picker',
    },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearchChange = (value: string) => {
    if (value) {
      const filtered = regionOptions.filter((item) =>
        item?.label?.toLowerCase().includes(value?.toLowerCase())
      );
      setRegionOptions(filtered);
    } else {
      const regionOptions = getRegionOptions();
      setRegionOptions(regionOptions);
    }
  };

  const handleApplyFilters = () => {
    setRegion(regionSelected, { shallow: false });
    setBoundary(boundarySelected, { shallow: false });
    setTimePeriod(timePeriodSelected, { shallow: false });
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
            <DrawerTitle className="flex justify-between ">
              <Text variant="headingMd">Options</Text>
              <IconButton
                icon={Icons.cross}
                onClick={toggleDrawer}
                color="default"
              >
                Close
              </IconButton>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="flex h-[276px]">
            <div className="flex flex-col gap-3 border-x-1 border-solid border-borderSubdued p-4">
              {FilterOptions.map((item, index) => (
                <div key={`${item.value}-${index}`}>
                  <Button
                    className={cn('min-w-[40px] text-textDefault')}
                    size="slim"
                    fullWidth
                    kind="tertiary"
                    variant="interactive"
                    // onClick={() => boundarySelection()}
                    onClick={() => setSelectedOption(item?.value)}
                  >
                    <Text>{item.title}</Text>
                  </Button>
                </div>
              ))}
            </div>
            <div className="w-full overflow-x-auto p-4">
              <RenderOptions
                filterOptions={FilterOptions}
                selectedOption={selectedOption}
                boundary={boundary}
                timePeriod={timePeriod}
                timePeriodData={timePeriods}
                setBoundarySelected={setBoundarySelected}
                setRegionSelected={setRegionSelected}
                setTimePeriodSelected={setTimePeriodSelected}
                handleInputChangeCallback={(value: string) =>
                  handleSearchChange(value)
                }
              />
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
            <DrawerClose onClick={toggleDrawer} asChild>
              <Button
                onClick={handleApplyFilters}
                className=" bg-[#71E57D]"
                size="large"
              >
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

export const RenderOptions = ({
  filterOptions,
  selectedOption,
  boundary,
  timePeriod,
  timePeriodData,
  handleInputChangeCallback,
  setBoundarySelected,
  setRegionSelected,
  setTimePeriodSelected,
}: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );
  const type = findSelectedValue[0]['type'];
  const value = findSelectedValue[0]['value'];
  const options = findSelectedValue[0]['options'];

  const onRadioButtonChange = (selectedValue: string, value: string) => {
    if (value === 'boundary') {
      setBoundarySelected(selectedValue);
      setRegionSelected('');
    } else {
      setRegionSelected(selectedValue);
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
        <React.Fragment>
          {value === 'region' && (
            <TextField
              label="Search"
              name="name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e), handleInputChangeCallback(e);
              }}
            />
          )}
          <RadioGroup
            onChange={(e) => {
              onRadioButtonChange(e, value);
            }}
            name={value}
            defaultValue={boundary}
          >
            {options?.map(
              (item: { value: string; label: string }, index: number) => (
                <RadioItem key={`${item.value}-${index}`} value={item.value}>
                  {item.label}
                </RadioItem>
              )
            )}
          </RadioGroup>
        </React.Fragment>
      );
    case 'month-picker':
      return (
        <MonthPicker
          name="time-period-select"
          defaultValue={parseDate('2023-08-01')}
          label="Select Month"
          minValue={parseDate(minDate || '2023-01-04')}
          maxValue={parseDate(maxDate || '2023-01-04')}
          onChange={(date) => {
            setTimePeriodSelected(
              `${date.year}_${date.month < 10 ? `0${date.month}` : `${date.month}`}`
            );
          }}
        />
      );
  }
};
