'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from 'opub-ui';

import { datasetsExplorerPageHeader } from '@/config/consts';
import { DATASET_BY_SLUG } from '@/config/graphql/dataset-queries';
import { deployment, serverUrl } from '@/config/site';
import { GraphQL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import { DatasetInfoCard } from './DatasetInfoCard';
import { DatasetResources } from './DatasetResources';
import { MetadataCard } from './MetadataCard';

export function Content({ slug }: { slug: string }) {
  const { data } = useQuery([`dataset_by_slug_${slug}`], () =>
    GraphQL(`${serverUrl['backend-url']}/graphql`, DATASET_BY_SLUG, {
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
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* window */}
        <div className="container grid flex-col gap-8 px-10 py-6">
          <Text className=" pt-4" variant="heading2xl" fontWeight="bold">
            {datasetsExplorerPageHeader}
          </Text>

          <div className="flex flex-col gap-8">
            <DatasetInfoCard
              title={explorerData?.title || 'NA'}
              description={explorerData?.description || 'NA'}
              source={explorerData?.source || 'NA'}
              // homepage={explorerData?.catalog?.organization?.homepage || '#'}
              homepage={explorerData?.contact_point || '#'}
            />

            <div className="bg-surface flex items-start gap-3 ">
              <div className="flex h-[100%] grow gap-1  bg-surfaceDefault shadow-elementCard ">
                <Tabs className="w-[100%]" defaultValue="data-resources">
                  <TabList className=" bg-[#96E79E] bg-opacity-90 shadow-insetButton">
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
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* mobile */}
        <div className="container flex-col gap-6 px-2 py-8">
          <div className="flex w-full flex-col flex-wrap gap-3 px-3 py-3">
            <DatasetInfoCard
              title={explorerData?.title || 'NA'}
              description={explorerData?.description || 'NA'}
              source={explorerData?.source || 'NA'}
              // homepage={explorerData?.catalog?.organization?.homepage || '#'}
              homepage={explorerData?.contact_point || '#'}
            />
          </div>
          <div className="px-3 py-3">
            <Accordion type="single" defaultValue="time-trends" collapsible>
              <AccordionItem value="revenue-circle" className="mt-4">
                <div className="mt-7">
                  <div className="flex items-center justify-between  border-solid bg-baseIndigoSolid1 px-4">
                    <Text variant="bodyLg" fontWeight="bold">
                      METADATA
                    </Text>
                    <AccordionTrigger />
                  </div>
                  <AccordionContent>
                    <div className="border- h-[100%] basis-[380px] rounded-2 bg-surfaceDefault shadow-elementCard ">
                      <MetadataCard
                        lastUpdated={formatDate(explorerData?.modified) || 'NA'}
                        updateFrequency={explorerData?.update_frequency || 'NA'}
                        fileTypes={explorerData?.resource_set.map(
                          (item) => item?.file_details?.format || 'NA'
                        )}
                        tags={(explorerData?.tags || []).map(
                          (item) => item?.name || 'NA'
                        )}
                        licenses={(
                          explorerData?.datasetaccessmodel_set || []
                        ).map(
                          (item) => item.data_access_model.license.title || 'NA'
                        )}
                      />
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" defaultValue="time-trends" collapsible>
              <AccordionItem value="revenue-circle" className="mt-4">
                <div className="mt-7">
                  <div className="flex items-center justify-between  border-solid bg-baseIndigoSolid1 px-4">
                    <Text variant="bodyLg" fontWeight="bold">
                      DATASET RESOURCES
                    </Text>
                    <AccordionTrigger />
                  </div>
                  <AccordionContent>
                    <div className="flex h-[100%] grow   bg-surfaceDefault shadow-elementCard ">
                      <Tabs className="w-[100%]" defaultValue="data-resources">
                        {tabContent.map((tab) => (
                          <TabPanel value={tab.value} key={tab.value}>
                            <div className="relative mt-5 overflow-y-auto px-4">
                              {tab.content}
                            </div>
                          </TabPanel>
                        ))}
                      </Tabs>
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </MediaRendering>
    </>
  );
}
