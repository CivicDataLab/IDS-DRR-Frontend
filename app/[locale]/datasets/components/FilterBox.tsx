'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FilterProps } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Checkbox, Icon, Text, Tooltip } from 'opub-ui';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import styles from './Filter.module.scss';

export const FilterBox = ({
  filters,
  selectedFilters,
}: {
  filters: FilterProps[];
  selectedFilters: any;
}) => {
  const router = useRouter();
  const [, setSelectedFilter] = React.useState<{
    [key: string]: string[];
  }>({});

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

  const filteredFilters = filters.filter(
    (filter) => !Object.prototype.hasOwnProperty.call(filter, 'geography')
  );

  const categoryIndex = filteredFilters.findIndex((obj) =>
    Object.prototype.hasOwnProperty.call(obj, 'category')
  );

  // If "category" exists and it's not already the first object, move it to the beginning
  if (categoryIndex !== -1 && categoryIndex !== 0) {
    const categoryObj = filteredFilters.splice(categoryIndex, 1)[0]; // Remove the category object
    filteredFilters.unshift(categoryObj); // Add it to the beginning
  }

  const sourceIndex = filteredFilters.findIndex((obj) =>
    Object.prototype.hasOwnProperty.call(obj, 'source')
  );

  if (sourceIndex !== -1 && sourceIndex !== 1) {
    const sourceObj = filteredFilters.splice(sourceIndex, 1)[0];
    filteredFilters.splice(1, 0, sourceObj); // Insert it at the second positionx
  }

  return (
    <div className="flex flex-col gap-4">
      <Text className="text-[#8B8D98] " variant="bodyMd" fontWeight="medium">
        FILTERS
      </Text>
      {filteredFilters.map((item, index) => (
        <div key={index}>
          {Object.entries(item).map(
            ([key, value], keyIndex) =>
              key !== 'duration' && (
                <Collapsible
                  key={`${key}-${keyIndex}`}
                  defaultOpen
                  className="rounded-1 border-1 border-solid border-borderSubdued"
                >
                  <div className=" bg-surfaceNeutral border-t-0 min-w-max max-w-full rounded-1 border-1 border-solid border-borderSubdued bg-[#96E79E]  bg-opacity-90">
                    <CollapsibleTrigger className={styles.CollapseTrigger}>
                      <Text
                        className="capitalize text-[#1C2024]"
                        key={key}
                        variant="headingMd"
                        as="h3"
                      >
                        {key}
                      </Text>
                      <Icon source={Icons.down} />
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent
                    className={cn(
                      'min-w-max max-w-full px-2 pb-4',
                      styles.CollapsibleContent
                    )}
                  >
                    <div className="mt-4 flex flex-col gap-3">
                      {value.map((itemValue, itemIndex) => (
                        <Checkbox
                          className=" w-[100px] overflow-hidden text-ellipsis"
                          key={itemIndex}
                          name={itemValue}
                          checked={
                            checkIfPresent(key, itemValue) ? true : false
                          }
                          onChange={(changed) => {
                            setSelectedFilter((prevSelectedFilter) => {
                              let updatedArray;
                              if (!changed) {
                                updatedArray = (
                                  prevSelectedFilter[key] || []
                                ).filter((value) => value !== itemValue);
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
                          <Tooltip content={<Text>{itemValue}</Text>}>
                            {itemValue}
                          </Tooltip>
                        </Checkbox>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
          )}
        </div>
      ))}
    </div>
  );
};
