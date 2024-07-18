import React, { useEffect, useState } from 'react';
import SearchSvg from '@/public/Search';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
import {
  Button,
  Icon,
  RadioGroup,
  RadioItem,
  SearchInput,
  TextField,
  YearCalendar,
} from 'opub-ui';

import {
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { deployment, serverUrl } from '@/config/site';
import { GraphQL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Icons from '@/components/icons';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';
import { constructRegionOptions } from '../utils/utils';

export function FilterComp({ timePeriod }: { timePeriod: string }) {
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState('boundary');

  const [regionOptions, setRegionOptions] = useState<Option[] | never[]>([]);

  const [boundary, setBoundary] = useQueryState(
    'boundary',
    parseAsString.withDefault('district')
  );

  const [timePeriodParam, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [region, setRegion] = useQueryState('region');

  const [boundarySelected, setBoundarySelected] = useState(boundary);

  const [regionSelected, setRegionSelected] = useState(region);

  const [timePeriodSelected, setTimePeriodSelected] = useState(timePeriodParam);

  useEffect(() => {
    setBoundarySelected(boundary);
    setRegionSelected(region || '');
    setTimePeriodSelected(timePeriodParam);
  }, [boundary, region, timePeriodParam]);

  const geographiesData = useQuery(
    [`geographies_data_${boundarySelected}`],
    () =>
      GraphQL(
        `${serverUrl['data-management-url']}/graphql`,
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
        `${serverUrl['data-management-url']}/graphql`,
        ANALYTICS_TIME_PERIODS
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const getRegionOptions = React.useCallback(() => {
    const regionOptions = constructRegionOptions(
      boundarySelected,
      geographiesData
    );
    if (boundarySelected === 'revenue-circle' && geographiesData.data) {
      const rawData = geographiesData?.data?.getDistrictRevCircle;
      const formattedOptions = [];
      for (const district in rawData) {
        formattedOptions.push({
          label: district,
          value: district,
          type: 'group',
        });
        rawData[district].forEach(
          (circle: { 'revenue-circle': string; code: string }) => {
            formattedOptions.push({
              label: circle['revenue-circle'],
              value: circle.code,
              type: 'item',
            });
          }
        );
      }
      return formattedOptions;
    }
    return regionOptions;
  }, [boundarySelected, geographiesData]);

  const FilterOptions: FilterButtonOption = [
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
      options: getRegionOptions(),
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
    // const regionOptions = getRegionOptions();
    const regionOptions = FilterOptions[1].options;
    if (regionOptions) {
      if (value) {
        const filtered = regionOptions.filter((item) =>
          item?.label?.toLowerCase().includes(value?.toLowerCase())
        );

        setRegionOptions(filtered);
      } else {
        setRegionOptions(regionOptions);
      }
    }
  };

  const handleApplyFilters = () => {
    setRegion(regionSelected, { shallow: false });
    setBoundary(boundarySelected, { shallow: false });
    setTimePeriod(timePeriodSelected, { shallow: false });
  };

  const handleClearAllFilters = () => {
    toggleDrawer();
    setBoundarySelected(boundary);
    setRegionSelected('');
    setTimePeriodSelected(timePeriod);
    setRegion('', { shallow: false });
    setBoundary(boundary, { shallow: false });
    setTimePeriod(timePeriod, { shallow: false });
  };

  return (
    <>
      <Button
        className="m-0 ml-auto border-1 border-solid border-[#8C9196]"
        kind="tertiary"
        onClick={toggleDrawer}
      >
        <Icon source={Icons.filter} />
      </Button>

      <MobileFilterBox
        filterOptions={FilterOptions}
        handleApplyFilters={handleApplyFilters}
        onSelectedOption={(selectedOption) => setSelectedOption(selectedOption)}
        open={isDrawerOpen}
        handleClearFilters={handleClearAllFilters}
        toggleDrawerCallback={toggleDrawer}
      >
        <MobileFilterContent>
          <RenderOptions
            filterOptions={FilterOptions}
            selectedOption={selectedOption}
            boundarySelected={boundarySelected}
            timePeriod={timePeriod}
            timePeriodData={timePeriods}
            setBoundarySelected={setBoundarySelected}
            setRegionSelected={setRegionSelected}
            regionSelected={regionSelected}
            setTimePeriodSelected={setTimePeriodSelected}
            handleInputChangeCallback={(value: string) =>
              handleSearchChange(value)
            }
            regionOptions={regionOptions}
          />
        </MobileFilterContent>
      </MobileFilterBox>
    </>
  );
}

export const RenderOptions = ({
  filterOptions,
  selectedOption,
  boundarySelected,
  timePeriodData,
  handleInputChangeCallback,
  setBoundarySelected,
  setRegionSelected,
  setTimePeriodSelected,
  regionOptions,
  regionSelected,
}: any) => {
  // console.log('---', regionSelected, boundary, timePeriodData);
  const [searchQuery, setSearchQuery] = useState('');

  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );
  const type = findSelectedValue[0]['type'];
  const value = findSelectedValue[0]['value'];
  const options = findSelectedValue[0]['options'];

  const filteredFindOption = regionOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );

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
            // key={value === 'boundary' ? boundary : regionSelected}
            name={value}
            value={value === 'boundary' ? boundarySelected : regionSelected}
          >
            {searchQuery === ''
              ? // Render original options if search query is empty
                options?.map(
                  (
                    item: { value: string; label: string; type: string },
                    idx: number
                  ) =>
                    item.type === 'group' ? (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#F7F7F8',
                          padding: '4px',
                          marginTop: '15px',
                          fontWeight: 'bold',
                          // textDecoration: 'underline',
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
              : // Render filtered options based on search query
                regionOptions?.map(
                  (
                    item: { value: string; label: string; type: string },
                    idx: number
                  ) =>
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
                )}
          </RadioGroup>
        </React.Fragment>
      );
    case 'month-picker':
      return (
        <div className=" self-center">
          <YearCalendar
            defaultValue={parseDate('2023-08-01')}
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
