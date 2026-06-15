'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'opub-ui';

import { DATASET_QUERY } from '@/config/graphql/dataset-queries';
import { GraphQL } from '@/lib/api';
import { routes } from '@/lib/routes';
import BreadCrumbs from '.././components/BreadCrumbs';
import Details from './components/Details';
import Metadata from './components/Metadata';
import PrimaryData from './components/PrimaryData';
import Resources from './components/Resources';

// Define the query as a gql template literal

const DatasetDetailsPage = () => {
  const primaryDataRef = useRef<HTMLDivElement>(null); // Explicitly specify the type of ref

  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['dataset_details', params.dataset],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`,
        DATASET_QUERY,
        {
          filters: { id: params.dataset },
        }
      ),
    enabled: !!params.dataset,
  });

  return (
    <main style={{ background: '#F0F9F1' }}>
      <BreadCrumbs
        data={[
          { href: routes.home, label: 'Home' },
          { href: routes.datasets(), label: 'Datasets' },
          { href: '#', label: 'Dataset Details' },
        ]}
      />
      {isLoading ? (
        <div
          className=" flex  items-center justify-center"
          style={{ height: '76vh' }}
        >
          <Spinner size={30} />
        </div>
      ) : (
        <div className="flex w-full gap-7 md:px-8 lg:px-8">
          <div className="w-full flex-grow py-8 ">
            <div className=" flex flex-col gap-5  ">
              <div ref={primaryDataRef} className="flex flex-col gap-4">
                {isLoading ? (
                  <div className=" mt-8 flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <PrimaryData
                    data={data && data?.datasets[0]}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
            <div className=" mt-5 flex w-full">
              <div className="w-full lg:w-9/12">
                <Details />
                <Resources />
              </div>
              <div className=" hidden flex-col gap-8 border-l-2 border-solid border-baseGraySlateSolid3 py-6 pl-7 lg:flex ">
                {isLoading ? (
                  <div className=" mt-8 flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div>
                    <Metadata data={data && data?.datasets[0]} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DatasetDetailsPage;
