'use client';

import { useQuery } from '@tanstack/react-query';
import { TabList, TabPanel, Tabs, Text } from 'opub-ui';

import { datasetsExplorerPageHeader } from '@/config/consts';
import { DATASET_BY_SLUG } from '@/config/graphql/dataset-queries';
import { GraphQL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { DatasetInfoCard } from './DatasetInfoCard';
import { DatasetResources } from './DatasetResources';
import { MetadataCard } from './MetadataCard';

export function Content({ slug }: { slug: string }) {
  const { data } = useQuery([`dataset_by_slug_${slug}`], () =>
    GraphQL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, DATASET_BY_SLUG, {
      dataset_slug: slug,
    })
  );

  const explorerData = data?.dataset_by_slug;

  const tabContent = [
    {
      label: 'Data Resources',
      value: 'data-resources',
      content:
        explorerData?.resource_set?.length !== 0 ? (
          explorerData?.resource_set.map((resource, index) => (
            <DatasetResources
              key={index}
              id={resource?.id}
              fileName={resource?.title || 'NA'}
              modified={resource?.modified}
              format={resource?.file_details?.format || 'NA'}
              description={resource?.description}
            />
          ))
        ) : (
          <Text>Not Found</Text>
        ),
    },
  ];

  const tabList = [
    {
      label: 'Data Resources',
      value: 'data-resources',
    },
  ];

  return (
    <div className="container grid flex-col gap-8 px-10 py-6">
      <Text className=" pt-4" variant="heading2xl" fontWeight="bold">
        {datasetsExplorerPageHeader}
      </Text>

      <div className="flex flex-col gap-8">
        <DatasetInfoCard
          title={explorerData?.title || 'NA'}
          description={explorerData?.description || 'NA'}
          source={explorerData?.catalog?.organization?.title || 'NA'}
          homepage={explorerData?.catalog?.organization?.homepage || '#'}
        />

        <div className="bg-surface flex items-start gap-3 ">
          <div className="flex h-[100%] grow gap-1  bg-surfaceDefault shadow-elementCard ">
            <Tabs className="w-[100%]" defaultValue="data-resources">
              <TabList className=" bg-[#96E79E] shadow-insetButton">
                <div className="flex flex-1  justify-center py-3 ">
                  <Text
                    variant="headingLg"
                    fontWeight="semibold"
                    color="subdued"
                  >
                    {tabList[0].label}
                  </Text>
                </div>
              </TabList>
              {tabContent.map((tab) => (
                <TabPanel value={tab.value} key={tab.value}>
                  <div className="relative mt-5 overflow-y-auto  px-8">
                    {tab.content}
                  </div>
                </TabPanel>
              ))}
            </Tabs>
          </div>

          <div className="h-[100%] basis-[380px] bg-surfaceDefault shadow-elementCard ">
            <MetadataCard
              lastUpdated={formatDate(explorerData?.modified) || 'NA'}
              updateFrequency={explorerData?.update_frequency || 'NA'}
              fileTypes={explorerData?.resource_set.map(
                (item) => item?.file_details?.format || 'NA'
              )}
              tags={(explorerData?.tags || []).map(
                (item) => item?.name || 'NA'
              )}
              licenses={(explorerData?.datasetaccessmodel_set || []).map(
                (item) => item.data_access_model.license.title || 'NA'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
