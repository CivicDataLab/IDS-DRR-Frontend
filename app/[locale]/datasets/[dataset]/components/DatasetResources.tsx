import { useState } from 'react';
import { Button, Tag, Text } from 'opub-ui';

import { backendUrl } from '@/config/site';
import { formatDate } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';

export const DatasetResources = ({
  id,
  fileName,
  description,
  modified,
  format,
}: {
  id: string;
  fileName: string;
  description: string;
  modified: string;
  format: string;
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* MOBILE  */}
        <div className="mb-8 flex flex-col gap-1">
          <div className="flex flex-row items-start justify-between gap-5 self-stretch">
            <div className="flex w-[328px] flex-col gap-2">
              {/* <div className="flex content-between items-center self-stretch"> */}
              <Text
                fontWeight="semibold"
                className="text-ellipsis"
                variant="headingSm"
              >
                {fileName}
              </Text>
              <div className="">
                <Tag>{format}</Tag>
              </div>

              <Text variant="headingSm" fontWeight="medium">
                Updated : {formatDate(modified)}
              </Text>
            </div>
          </div>

          <div className="flex flex-col gap-2 pr-1">
            <Text
              className={!showMore ? 'line-clamp-2' : ''}
              variant="bodySm"
              fontWeight="medium"
              color="disabled"
            >
              {description}
            </Text>
            {!showMore && (
              <Button
                className="self-end"
                onClick={() => setShowMore(true)}
                variant="interactive"
                size="slim"
                kind="tertiary"
              >
                Show more
              </Button>
            )}
            {showMore && (
              <Button
                className="self-end"
                onClick={() => setShowMore(false)}
                variant="interactive"
                size="slim"
                kind="tertiary"
              >
                Show less
              </Button>
            )}
          </div>

          <Button
            onClick={() =>
              (window.location.href = `${backendUrl.datasets}/download/${parseInt(id)}/`)
            }
            className=" bg-[#71E57D] text-baseGraySlateSolid12 shadow-insetButton "
          >
            Download
          </Button>
        </div>
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* WINDOWS  */}
        <div className="mb-4 flex flex-col gap-1">
          <div className="flex flex-row items-start justify-between gap-5 self-stretch">
            <div className="flex w-[356px] flex-col gap-1">
              <div className="flex gap-3">
                <Text fontWeight="semibold" variant="headingMd">
                  {fileName}
                </Text>
                <Tag>{format}</Tag>
              </div>

              <Text variant="headingXs" fontWeight="medium">
                Updated : {formatDate(modified)}
              </Text>
            </div>

            <Button
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/download/${parseInt(id)}/`)
              }
              className="w-[136px] bg-[#71E57D] text-baseGraySlateSolid12 shadow-insetButton "
            >
              Download
            </Button>
          </div>
          <div className="flex w-[320px] flex-col">
            <Text
              className=" block w-[320px]"
              variant="headingXs"
              fontWeight="medium"
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
      </MediaRendering>
    </>
  );
};
