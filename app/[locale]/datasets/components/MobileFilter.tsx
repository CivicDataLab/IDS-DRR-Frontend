import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterProps } from '@/types';
import { Button, Checkbox, Icon, Text } from 'opub-ui';

import Icons from '@/components/icons';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';

export function MobileFilter({
  filters,
  selectedFilters,
}: {
  filters: FilterProps[];
  selectedFilters: any;
}) {
  const router = useRouter();

  type FilterButtonOption = {
    title: string;
    value: string;
    options?: string[];
    type: string;
  }[];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState('category');

  const [filtersSelected, setSelectedFilter] = React.useState<{
    [key: string]: string[];
  }>(selectedFilters);

  const generateURL = (filtersSelected: { [key: string]: string[] }) => {
    const keys = Object.keys(filtersSelected);

    const params = new URLSearchParams(window.location.search);

    keys.forEach((key) => {
      const existingKey = params?.has(key);
      if (existingKey) {
        // If the key already exists, append the new filters to it with a comma
        params.set(key, `${filtersSelected[key].join(',')}`);
      } else {
        // If the key doesn't exist, set the filtersSelected directly under that key
        params.set(key, filtersSelected[key].join(','));
      }
    });
    const updatedQueryString = params.toString();

    return router.push(`/datasets/?${updatedQueryString}`);
  };

  const getFilterOptions = (key: string) => {
    return filters.filter((item) =>
      Object.prototype.hasOwnProperty.call(item, key)
    )[0][key];
  };

  const FilterOptions: FilterButtonOption = [
    {
      title: 'Category',
      value: 'category',
      options: getFilterOptions('category'),
      type: 'checkbox',
    },
    {
      title: 'Geography',
      value: 'geography',
      options: getFilterOptions('geography'),
      type: 'checkbox',
    },
    {
      title: 'File Format',
      value: 'format',
      options: getFilterOptions('format'),
      type: 'checkbox',
    },
    {
      title: 'Source',
      value: 'source',
      options: getFilterOptions('source'),
      type: 'checkbox',
    },
  ];

  //when apply button is clicked
  const handleApplyFilters = () => {
    for (let key in filtersSelected) {
      // Check if the key is numeric
      if (!isNaN(Number(key))) {
        // Use the delete operator to remove the key
        delete filtersSelected[key];
      }
    }

    const keys = Object.keys(filtersSelected);

    const params = new URLSearchParams(window.location.search);

    keys.forEach((key) => {
      const existingKey = params?.has(key);
      if (existingKey) {
        // If the key already exists, append the new filters to it with a comma
        params.set(key, `${filtersSelected[key].join(',')}`);
      } else {
        // If the key doesn't exist, set the filtersSelected directly under that key
        params.set(key, filtersSelected[key].join(','));
      }
    });
    const updatedQueryString = params.toString();

    return router.push(`/datasets/?${updatedQueryString}`);
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

      <MobileFilterBox
        filterOptions={FilterOptions}
        handleApplyFilters={handleApplyFilters}
        onSelectedOption={(selectedOption) => setSelectedOption(selectedOption)}
        open={isDrawerOpen}
        handleClearFilters={() => {
          router.push(`/datasets/`);
          setSelectedFilter({}), toggleDrawer();
        }}
        toggleDrawerCallback={toggleDrawer}
      >
        <MobileFilterContent>
          <RenderOptions
            filterOptions={FilterOptions}
            selectedOption={selectedOption}
            filters={filters}
            selectedFilters={filtersSelected}
            generateURL={generateURL}
            setSelectedFilter={setSelectedFilter}
          />
        </MobileFilterContent>
      </MobileFilterBox>
    </>
  );
}

export const RenderOptions = ({
  filterOptions,
  selectedOption,
  selectedFilters,
  setSelectedFilter,
}: any) => {
  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );

  const options = findSelectedValue[0]['options'];

  const checkIfPresent = (filterGroup: string, filterValue: string) => {
    return (
      Array.isArray(selectedFilters) &&
      selectedFilters?.some((item: { [x: string]: string | string[] }) => {
        if (Object.prototype.hasOwnProperty.call(item, filterGroup)) {
          return item[filterGroup][0].split(',').includes(filterValue);
        }
        return false;
      })
    );
  };

  return options.map((option: string, index: React.Key) => (
    <Checkbox
      key={`${option}-${index}`}
      checked={
        checkIfPresent(selectedOption, option)
          ? true
          : selectedFilters[selectedOption]?.includes(option) || false
      }
      name="checkbox"
      onChange={(changed) => {
        setSelectedFilter((prevSelectedFilter: { [x: string]: any }) => {
          let updatedArray;
          if (!changed) {
            updatedArray = (prevSelectedFilter[selectedOption] || []).filter(
              (value: any) => value !== option
            );
          } else {
            updatedArray = [
              ...(prevSelectedFilter[selectedOption] || []),
              option,
            ];
          }
          const updatedFilter = {
            ...prevSelectedFilter,
            [selectedOption]: updatedArray,
          };
          return updatedFilter;
        });
      }}
    >
      <Text>{option}</Text>
    </Checkbox>
  ));
};
