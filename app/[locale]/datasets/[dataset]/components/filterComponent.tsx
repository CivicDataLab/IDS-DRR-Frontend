import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterProps } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { useQueryState } from 'next-usequerystate';
import { Button, Checkbox, Icon, RadioGroup, RadioItem } from 'opub-ui';

import Icons from '@/components/icons';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';

export function DatasetsFilterComp({
  filters,
  selectedFilters,
}: {
  filters: FilterProps[];
  selectedFilters: any;
}) {
  const router = useRouter();
  const [, setSelectedFilter] = React.useState<{
    [key: string]: string[];
  }>({});
  //   interface Option {
  //     disabled?: boolean;
  //     value: string;
  //     label: string;
  //     type?: string;
  //   }

  type FilterButtonOption = {
    title: string;
    value: string;
    // options?: Option[];
    type: string;
  }[];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');

  const [category, setCategory] = useQueryState('category');

  const [geography, setGeography] = useQueryState('');

  const [fileFormat, setFileFormat] = useQueryState('');
  const [source, setSource] = useQueryState('');

  // after selection

  const [categorySelected, setCategorySelected] = useState('');

  const [geographySelected, setGeographySelected] = useState('');
  const [fileFormatSelected, setFileFormatSelected] = useState('');
  const [sourceSelected, setSourceSelected] = useState('');

  const generateURL = (key: string, filtersSelected: string[]) => {
    const params = new URLSearchParams(window.location.search);

    const existingKey = params?.has(key);

    if (existingKey) {
      // If the key already exists, append the new filters to it with a comma
      params.set(key, `${filtersSelected.join(',')}`);
    } else {
      // If the key doesn't exist, set the filtersSelected directly under that key
      params.set(key, filtersSelected.join(','));
    }

    const updatedQueryString = params.toString();

    return router.push(`/datasets/?${updatedQueryString}`);
  };

  const checkIfPresent = (filterGroup: string, filterValue: string) => {
    return selectedFilters.some((item: { [x: string]: string | string[] }) => {
      if (Object.prototype.hasOwnProperty.call(item, filterGroup)) {
        return item[filterGroup][0].split(',').includes(filterValue);
      }
      return false;
    });
  };

  const FilterOptions: FilterButtonOption = [
    {
      title: 'Category',
      value: 'category',
      type: 'radio-button',
    },
    {
      title: 'Geography',
      value: 'geography',
      type: 'radio-button',
    },
    {
      title: 'File Format',
      value: 'file-format',
      type: 'radio-button',
    },
    {
      title: 'Source',
      value: 'source',
      type: 'radio-button',
    },
  ];

  //when apply button is clicked
  const handleApplyFilters = () => {
    setCategory(categorySelected);
    setGeography(geographySelected);
    setFileFormat(fileFormatSelected);
    setSource(sourceSelected);
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
        toggleDrawerCallback={toggleDrawer}
      >
        <MobileFilterContent>
          <RenderOptions
            filterOptions={FilterOptions}
            selectedOption={selectedOption}
            category={category}
            geography={geography}
            fileFormat={fileFormat}
            source={source}
            setCategorySelected={setCategorySelected}
            setGeographySelected={setGeographySelected}
            setFileFormatSelected={setFileFormatSelected}
            setSourceSelected={setSourceSelected}
            filters={filters}
            selectedFilters={selectedFilters}
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
  category,
  geography,
  fileFormat,
  source,
  handleInputChangeCallback,
  setCategorySelected,
  setGeographySelected,
  setFileFormatSelected,
  setSourceSelected,
  filters,
  selectedFilters,
  generateURL,
  setSelectedFilter,
}: any) => {
  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );

  console.log('findSelectedValue', findSelectedValue);
  //   const type = findSelectedValue[0]['type'];
  const value = findSelectedValue[0]?.value ?? 'category';

  const onRadioButtonChange = (selectedValue: string, value: string) => {
    setCategorySelected(selectedValue);
    setGeographySelected(selectedValue);
    setFileFormatSelected(selectedValue);
    setSourceSelected(selectedValue);
  };

  return (
    <>
      <RadioGroup
        onChange={(e) => {
          onRadioButtonChange(e, value);
        }}
        name={value}
        defaultValue={category}
      >
        {/* <p>hii</p> */}
        {filters.map((item: any, index: any) => (
          <div key={index}>
            {Object.entries(item).map(([key, value], keyIndex) => {
              if (key === selectedOption && key !== 'duration') {
                return (
                  <div key={`${key}-${keyIndex}`}>
                    {/* Render filter options basis selected filterss */}
                    <RadioGroup
                      name={key}
                      defaultValue={selectedFilters[key]}
                      onChange={(e) => {
                        setSelectedFilter((prevSelectedFilter: any) => ({
                          ...prevSelectedFilter,
                          [key]: e.target.value,
                        }));
                        generateURL(key, [e.target.value]);
                      }}
                    >
                      {value.map((itemValue: any, itemIndex: any) => (
                        <RadioItem
                          key={itemIndex}
                          value={itemValue}
                          className="  overflow-hidden text-ellipsis"
                          onChange={(changed) => {
                            setSelectedFilter((prevSelectedFilter: any) => {
                              let updatedArray;
                              if (!changed) {
                                updatedArray = (
                                  prevSelectedFilter[key] || []
                                ).filter((value: any) => value !== itemValue);
                              } else {
                                updatedArray = [
                                  ...(prevSelectedFilter[key] || []),
                                  itemValue,
                                ];
                              }
                              const updatedFilter = {
                                ...prevSelectedFilter,
                                [key]: updatedArray,
                              };
                              generateURL(key, updatedFilter[key]);
                              return updatedFilter;
                            });
                          }}
                        >
                          {itemValue}
                        </RadioItem>
                      ))}
                    </RadioGroup>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        ))}
      </RadioGroup>
    </>
  );
};

// HIII;
