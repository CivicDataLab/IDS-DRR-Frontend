'use client';

// import { graphql } from '@/gql';
import React from 'react';
import SearchSvg from '@/public/Search';
import { Datasets, FilterProps } from '@/types';
import { useQueryState } from 'next-usequerystate';
import { Button, Divider, Icon, SearchInput, Select, Text } from 'opub-ui';

import { datasetsPageHeader } from '@/config/consts';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';
import { RenderOptions } from '../../analytics/components/filter-component';
import { DatasetsFilterComp } from '../[dataset]/components/filterComponent';
import { DatasetCard } from './DatasetCard';
import { FilterBox } from './FilterBox';

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

  const [searchValue, setSearchValue] = React.useState('');

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* window */}
        <div className="container mb-6 grid gap-4">
          <div className="mt-6 pl-5">
            <Text variant="heading2xl">{datasetsPageHeader}</Text>
          </div>

          <div className=" container  ">
            <div className="mr-6 flex flex-row items-center justify-end gap-6 border-b-1 bg-[#96E79E] px-8 py-3">
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
                      onSubmit={() => setQueryString('', { shallow: false })}
                      label="Search"
                      onChange={(value) => setSearchValue(value)}
                      defaultValue={queryString || ''}
                      onClear={() => setQueryString('', { shallow: false })}
                    />
                  </form>
                  <Button
                    onClick={() =>
                      setQueryString(searchValue, { shallow: false })
                    }
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
                        label: 'A-Z',
                        value: 'A-Z',
                      },
                      {
                        label: 'Recent',
                        value: 'Recent',
                      },
                    ]}
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
              {data.map((dataset, index) => (
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
            <SearchInput
              name="search"
              placeholder="Search by title, description..."
              onSubmit={() => setQueryString('', { shallow: false })}
              label="Search"
              onChange={(value) => setSearchValue(value)}
              defaultValue={queryString || ''}
              onClear={() => setQueryString('', { shallow: false })}
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

            <DatasetsFilterComp
              filters={filters}
              selectedFilters={selectedFilters}
            />
          </div>

          <div className="rounded flex flex-col gap-4 border-solid">
            {data.map((dataset, index) => (
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
