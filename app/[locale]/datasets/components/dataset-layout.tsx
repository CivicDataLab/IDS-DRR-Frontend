'use client';

// import { graphql } from '@/gql';
import React from 'react';
import SearchSvg from '@/public/Search';
import { Datasets, FilterProps } from '@/types';
import { useQueryState } from 'next-usequerystate';
import { Button, SearchInput, Select, Text, TextField } from 'opub-ui';

import { datasetsPageHeader } from '@/config/consts';
import environment from '@/config/environment';
import { MediaRendering } from '@/components/media-rendering';
import { DatasetCard } from './DatasetCard';
import { FilterBox } from './FilterBox';
import { MobileFilter } from './MobileFilter';

export function Content({
  count,
  data,
  filters,
  selectedFilters,
}: {
  count: number;
  data: Datasets[];
  filters: FilterProps[];
  selectedFilters: FilterProps[];
}) {
  const [queryString, setQueryString] = useQueryState('search');

  // const [searchValue, setSearchValue] = React.useState('');

  const [sortedData, setSortedData] = React.useState(data); // State to hold sorted data
  const [sortOption, setSortOption] = React.useState('');

  const [searchQuery, setSearchQuery] = React.useState('');

  // Function to handle sorting
  const handleSort = (option: string) => {
    if (option === 'A-Z') {
      const sorted = [...data].sort((a, b) => (a.title < b.title ? -1 : 1));

      setSortedData(sorted);
      setSortOption('A-Z');
    } else if (option === 'Recent') {
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b?.metaData?.lastUpdated).getTime() -
          new Date(a?.metaData?.lastUpdated).getTime()
      );
      setSortedData(sorted);
      setSortOption('Recent');
    }
  };

  // Effect to re-sort data when data prop changes
  React.useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleSearchChange = (value: string) => {
    const filteredData = data.filter((dataset) =>
      dataset.title.toLowerCase().includes(value.toLowerCase())
    );
    setSortedData(filteredData);
    // setSearchQuery(value);
  };

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* window */}
        <div className="container mb-6 grid gap-4">
          <div className="mt-6 pl-5">
            <Text variant="heading2xl">
              {environment.STATE_NAME} {datasetsPageHeader}
            </Text>
          </div>

          <div className=" container  ">
            <div className=" mr-6 flex flex-row items-center justify-end gap-6 border-b-1 bg-[#96E79E] bg-opacity-90 px-8 py-3 ">
              <div className="flex w-1/5 justify-start">
                <Text
                  className="shrink-0"
                  variant="bodyLg"
                  fontWeight="semibold"
                  color="subdued"
                >
                  Showing {count} datasets
                </Text>
              </div>

              <div className="flex w-4/5 flex-row items-stretch justify-between gap-8  ">
                <div className="flex h-[36px] w-[700px] items-center justify-start gap-2 pl-6">
                  <form className="flex-1">
                    <SearchInput
                      name="search"
                      placeholder="Search by title, description..."
                      label="Search"
                      defaultValue={searchQuery || ''}
                      onChange={(value) => {
                        setSearchQuery(value);
                        handleSearchChange(value);
                      }}
                      onClear={() => {
                        setSearchQuery('');
                        handleSearchChange('');
                      }}
                    />
                    {/* <TextField
                      label=""
                      name="name"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e);
                        handleSearchChange(e);
                      }}
                    /> */}
                  </form>
                  <Button
                    onClick={() => {
                      handleSearchChange(searchQuery);
                    }}
                    className="rounded-1 bg-baseIndigoSolid1 p-1 hover:bg-baseIndigoSolid1"
                  >
                    <SearchSvg />
                  </Button>
                </div>
                <div className="flex w-[290px] flex-row items-center justify-end  gap-2 ">
                  <Text
                    variant="headingMd"
                    fontWeight="semibold"
                    alignment="center"
                    color="subdued"
                  >
                    SORT BY:
                  </Text>
                  <Select
                    defaultValue="SORT BY :"
                    className="w-[150px]"
                    label=""
                    name="Sort-by"
                    options={[
                      {
                        label: 'Default',
                        value: 'Default',
                      },
                      {
                        label: 'A-Z',
                        value: 'A-Z',
                      },
                      {
                        label: 'Recent',
                        value: 'Recent',
                      },
                    ]}
                    onChange={(option) => handleSort(option)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container flex gap-10">
            <div className=" w-1/5 pt-6">
              <FilterBox filters={filters} selectedFilters={selectedFilters} />
            </div>
            <div className="rounded flex w-4/5 flex-col gap-4 border-solid p-6">
              {sortedData.map((dataset, index) => (
                <DatasetCard
                  key={index}
                  keyIndex={index}
                  title={dataset?.title || 'NA'}
                  source={dataset?.source || 'NA'}
                  description={dataset?.description || 'NA'}
                  lastUpdated={dataset?.metaData?.lastUpdated || 'NA'}
                  updateFrequency={dataset?.metaData?.updateFrequency || 'NA'}
                  period={dataset?.metaData?.period}
                  fileTypes={dataset?.metaData?.fileTypes}
                  slug={dataset?.slug || 'NA'}
                  categories={dataset?.categories}
                />
              ))}
            </div>
          </div>
        </div>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* mobile */}
        <div className="flex flex-col gap-6 px-8 py-10">
          <form className="flex-1">
            <TextField
              label=""
              name="name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e);
                handleSearchChange(e);
              }}
            />
          </form>
          <div className="flex items-center justify-between self-stretch border-b-2 border-solid border-borderSubdued px-1 pb-4 ">
            <Text
              className="shrink-0"
              variant="bodyLg"
              fontWeight="semibold"
              color="subdued"
            >
              Showing {count} datasets
            </Text>

            <MobileFilter filters={filters} selectedFilters={selectedFilters} />
          </div>

          <div className="rounded flex flex-col gap-4 border-solid">
            {sortedData.map((dataset, index) => (
              <DatasetCard
                key={index}
                keyIndex={index}
                title={dataset?.title || 'NA'}
                source={dataset?.source || 'NA'}
                description={dataset?.description || 'NA'}
                lastUpdated={dataset?.metaData?.lastUpdated || 'NA'}
                updateFrequency={dataset?.metaData?.updateFrequency || 'NA'}
                period={dataset?.metaData?.period}
                fileTypes={dataset?.metaData?.fileTypes}
                slug={dataset?.slug || 'NA'}
                categories={dataset?.categories}
              />
            ))}
          </div>
        </div>
      </MediaRendering>
    </>
  );
}
