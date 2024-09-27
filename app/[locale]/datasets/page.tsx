import React from 'react';
import { Datasets, FilterProps } from '@/types';
import { Spinner, Text } from 'opub-ui';

import { backendUrl, elasticSearchParams } from '@/config/site';
import { getData } from '@/lib/api';
import { Content } from './components/dataset-layout';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const params = Object.entries(searchParams)
    .filter(([, val]) => val != null && val != undefined)
    .map(([key, val]) => (key === 'search' ? `q=${val}` : `${key}=${val}`))
    .join('&');

  const urlToFetch = params
    ? `${backendUrl.datasets}/${elasticSearchParams.default}&${params}`
    : `${backendUrl.datasets}/${elasticSearchParams.default}`;

  const datasetData = await getData(urlToFetch);

  const filters: FilterProps[] = Object.keys(datasetData?.aggregations).map(
    (key) => ({
      [key]: datasetData?.aggregations[key]?.all?.buckets.map(
        (bucket: { key: string }) => bucket.key
      ),
    })
  );

  const data: Datasets[] = datasetData?.hits?.hits?.map((item: any) => {
    return {
      title: item._source?.dataset_title,
      slug: item._source?.slug,
      source: item._source?.source,
      description: item._source?.dataset_description,
      categories: item._source?.category,
      organization: {
        logo: item?.org_logo || 'NA',
      },
      metaData: {
        lastUpdated: item._source?.modified || 'NA',
        updateFrequency: item._source?.update_frequency || 'NA',
        period: [item._source?.period_from, item._source?.period_to],
        fileTypes: item?._source?.format || '',
        tags: item._source?.tags,
        licenses: item._source?.license,
      },
    };
  });

  return (
    <React.Suspense
      fallback={
        <div className="flex h-[100vh] flex-col  place-content-center items-center">
          <Spinner color="highlight" />
          <Text>Loading...</Text>
        </div>
      }
    >
      <Content
        count={datasetData?.hits?.total?.value}
        data={data}
        filters={filters}
        selectedFilters={datasetData?.selected_facets}
      />
    </React.Suspense>
  );
}
