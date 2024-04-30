import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Tag, Text } from 'opub-ui';

import { DatasetSource, LastUpdated, UpdateFreq } from '@/config/consts';
import { formatDate } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';

export interface DataProps {
  keyIndex: number;
  title: string;
  source: string;
  description: string;
  lastUpdated: string;
  updateFrequency: string;
  period: string[];
  fileTypes: string[];
  slug: string;
  categories: string[];
}
export const DatasetCard = ({
  keyIndex,
  title,
  source,
  description,
  lastUpdated,
  updateFrequency,
  fileTypes,
  period,
  slug,
  categories,
}: DataProps) => {
  const [showMore, setShowMore] = useState(false);
  const uniqueFileTypes = new Set(fileTypes);
  const fileTypesArray = Array.from(uniqueFileTypes);
  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* MOBILE  */}

        <div
          key={keyIndex}
          className="rounded-1 bg-surfaceDefault p-4 shadow-elementCard "
        >
          <div className="flex flex-wrap items-start gap-6  ">
            <div className="flex flex-col items-start gap-3 ">
              <Link href={`/datasets/${slug}`}>
                <Text
                  className=" text-textSubdued "
                  variant="headingLg"
                  as="p"
                  breakWord
                  fontWeight="semibold"
                >
                  {title}
                </Text>
              </Link>

              <span className="flex flex-col items-start gap-1">
                <Text
                  color="default"
                  className="  text-textSubdued  "
                  variant="bodySm"
                  fontWeight="regular"
                >
                  {DatasetSource} : {source}
                </Text>
                <Text
                  color="default"
                  className="  w-[280px] text-textSubdued "
                  variant="bodySm"
                  fontWeight="regular"
                >
                  Reference Period : {formatDate(period[0])} to{' '}
                  {formatDate(period[1])}
                </Text>
              </span>

              <div className="flex w-[256px] flex-wrap">
                <span className="flex flex-wrap items-center gap-2 py-1 pr-2">
                  {fileTypesArray?.length > 0 &&
                    fileTypesArray.map((fileType, index) => (
                      <Tag key={index} background-color="#E1F0FF">
                        {fileType}
                      </Tag>
                    ))}
                  <span className="flex gap-2 py-1 pr-2">
                    {categories?.length > 0 &&
                      categories?.map((category, index) => (
                        <Tag key={index} background-color="#E1F0FF">
                          {category}
                        </Tag>
                      ))}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex w-[256px] flex-col">
              <Text
                className="line-clamp-3"
                variant="bodyMd"
                as="p"
                color="default"
                truncate={!showMore}
              >
                {description}
              </Text>
              <Button
                className="self-end"
                onClick={() => setShowMore(!showMore)}
                variant="interactive"
                size="slim"
                kind="tertiary"
              >
                {showMore ? 'Show less' : 'Show more'}
              </Button>
            </div>
          </div>
        </div>
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* WINDOW  */}
        <Link href={`/datasets/${slug}`}>
          <div
            key={keyIndex}
            className="rounded-1 bg-surfaceDefault p-6 shadow-elementCard "
          >
            <div className="flex flex-wrap items-start gap-6 ">
              <div className="flex flex-1 flex-col flex-wrap items-start gap-3 p-0">
                <Text
                  className=" text-textSubdued "
                  variant="headingLg"
                  as="p"
                  breakWord
                  fontWeight="semibold"
                >
                  {title}
                </Text>
                <Text
                  color="default"
                  className=" text-textDefault "
                  variant="headingSm"
                  fontWeight="medium"
                >
                  {DatasetSource} : {source}
                </Text>
                <span className="flex flex-col items-start gap-1">
                  <Text
                    color="default"
                    className="  text-textSubdued  "
                    variant="bodySm"
                    fontWeight="regular"
                  >
                    {LastUpdated} : {formatDate(lastUpdated)} | {UpdateFreq} :{' '}
                    {updateFrequency}
                  </Text>
                  <Text
                    color="default"
                    className="  text-textSubdued  "
                    variant="bodySm"
                    fontWeight="regular"
                  >
                    Reference Period : {formatDate(period[0])} to{' '}
                    {formatDate(period[1])}
                  </Text>
                </span>

                <span className="flex items-center gap-4 py-1 pr-2">
                  {fileTypesArray?.length > 0 &&
                    fileTypesArray.map((fileType, index) => (
                      <Tag key={index} background-color="#E1F0FF">
                        {fileType}
                      </Tag>
                    ))}
                </span>
              </div>

              <div className="flex max-h-[150px] min-h-[150px] flex-1 flex-col gap-4 overflow-hidden">
                <Text
                  className="line-clamp-3"
                  variant="bodyMd"
                  as="p"
                  color="default"
                >
                  {description}
                </Text>
                <span className="flex gap-2 py-1 pr-2">
                  {categories?.length > 0 &&
                    categories?.map((category, index) => (
                      <Tag key={index} background-color="#E1F0FF">
                        {category}
                      </Tag>
                    ))}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </MediaRendering>
    </>
  );
};
