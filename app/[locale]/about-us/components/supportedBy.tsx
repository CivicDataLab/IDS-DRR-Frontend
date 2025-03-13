import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Icon, Text } from 'opub-ui';

import {
  PJMcPartnershipText,
  TheRockefellerFoundationTextOne,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';

export function SupportedBy() {
  const [showMore, setShowMore] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);

  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const toggleShowMore = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent link navigation
    event.stopPropagation(); // Stop event from propagating to the card's link
    setShowMore((prevState) => !prevState);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const isLong =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setIsDescriptionLong(isLong);
    }
  }, []);
  return (
    <section
      className="flex  flex-col flex-wrap py-14 "
      aria-label="Supported by"
    >
      <div className="container mb-2 flex flex-col gap-8 ">
        <Text variant="heading2xl" fontWeight="bold" color="default" as="h2">
          Supported By
        </Text>
        <div className="flex flex-wrap items-center justify-center gap-10 rounded-2 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
          <div className="flex flex-col items-center gap-4 text-surfaceDefault">
            <Image
              src="/logo/Rockefeller.png"
              height={190}
              width={230}
              alt="Rockefeller Logo"
              className=" object-contain "
            />
            <div className="flex items-center justify-between self-stretch">
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://rockefellerfoundation.org/')
                }
              >
                <img src="/web.svg" alt="RF link to website" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(
                    event,
                    'https://www.linkedin.com/company/the-rockefeller-foundation'
                  )
                }
              >
                <img src="/linkedin.svg" alt="RF link to LinkedIn" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://twitter.com/rockefellerfdn')
                }
              >
                <img src="/x.svg" alt="RF link to Twitter/X" />{' '}
              </Button>
            </div>
          </div>
          <div className=" flex   flex-col gap-3">
            <Text
              variant="headingXl"
              fontWeight="medium"
              color="default"
              as="h3"
            >
              The Rockefeller Foundation
            </Text>
            <div className="flex flex-col gap-5">
              <div>
                <div
                  ref={descriptionRef}
                  className={!showMore ? ' line-clamp-2 lg:line-clamp-5' : ''}
                >
                  <Text variant="bodyLg" fontWeight="regular" color="default">
                    {TheRockefellerFoundationTextOne} For more information, sign
                    up for their newsletter at{' '}
                    <a
                      href="https://rockefellerfoundation.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link underline"
                    >
                      rockefellerfoundation.org
                    </a>{' '}
                    and follow them on X @RockefellerFdn
                  </Text>
                </div>

                {/* Only show the "Show more" button on medium and small screens */}
                {isDescriptionLong && (
                  <div className="block md:hidden">
                    <Button
                      className="self-start p-2"
                      onClick={toggleShowMore}
                      variant="interactive"
                      size="slim"
                      kind="tertiary"
                    >
                      {showMore ? 'Show less' : 'Show more'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 rounded-2 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
          <div className="flex flex-col items-center gap-4 text-surfaceDefault">
            <Image
              src="/logo/PJMc.png"
              height={190}
              width={230}
              alt="Patrick J. McGovern Foundation logo"
              className=" object-contain "
            />
            <div className="flex flex-row items-center justify-between self-stretch">
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://www.mcgovern.org/')
                }
              >
                <img src="/web.svg" alt="PJMF link to website" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(
                    event,
                    'https://www.linkedin.com/company/mcgovern-foundation/'
                  )
                }
              >
                <img src="/linkedin.svg" alt="PJMF link to LinkedIn" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://x.com/PJMFnd')
                }
              >
                <img src="/x.svg" alt="PJMF link to Twitter/X" />{' '}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Text
              variant="headingXl"
              fontWeight="medium"
              color="default"
              as="h3"
            >
              Patrick J. McGovern Foundation{' '}
            </Text>
            <div className="flex flex-col gap-5">
              <div>
                <div
                  ref={descriptionRef}
                  className={!showMore ? ' line-clamp-2 lg:line-clamp-5' : ''}
                >
                  <Text variant="bodyLg" fontWeight="regular" color="default">
                    {PJMcPartnershipText}
                  </Text>
                </div>

                {/* Only show the "Show more" button on medium and small screens */}
                {isDescriptionLong && (
                  <div className="block md:hidden">
                    <Button
                      className="self-start p-2"
                      onClick={toggleShowMore}
                      variant="interactive"
                      size="slim"
                      kind="tertiary"
                    >
                      {showMore ? 'Show less' : 'Show more'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
