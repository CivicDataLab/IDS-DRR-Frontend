import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Icon, Text } from 'opub-ui';

import {
  CollaboratingPartnerHPText,
  CollaboratingPartnerTextOne,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';

export function CollaboratingPartner() {
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
      className="flex h-full flex-col flex-wrap py-14 "
      aria-label="Partners collaborating on this project"
    >
      <div className="container flex flex-col gap-8">
        <Text variant="heading2xl" fontWeight="bold" color="default" as="h2">
          Collaborating partner
        </Text>
        {/* DESKTOP  */}
        <div className="flex flex-wrap items-center justify-center gap-10 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
          <div className="flex flex-col items-center gap-4 text-surfaceDefault">
            <Image
              src="/logo/ASDMA.png"
              height={190}
              width={230}
              alt="ASDMA Logo"
              className=" object-contain "
            />
            <div className="flex flex-row items-center justify-between self-stretch">
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://asdma.assam.gov.in/')
                }
              >
                <img src="/web.svg" alt="ASDMA website link" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://asdma.assam.gov.in/')
                }
              >
                <img src="/linkedin.svg" alt="ASDMA LinkedIn link" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://x.com/sdma_assam')
                }
              >
                <img src="/x.svg" alt="ASDMA Twitter link" />{' '}
              </Button>
            </div>
          </div>
          <div className=" flex  flex-col gap-3">
            <Text
              variant="headingXl"
              fontWeight="medium"
              color="default"
              as="h3"
            >
              Assam State Disaster Management Authority
            </Text>

            <div className="flex flex-col gap-5">
              <div>
                <div
                  ref={descriptionRef}
                  className={!showMore ? ' line-clamp-2 lg:line-clamp-5' : ''}
                >
                  <Text variant="bodyLg" fontWeight="regular" color="default">
                    {/* {CollaboratingPartnerTextOne} */}
                    {CollaboratingPartnerTextOne}
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
        <div className="flex flex-wrap items-center justify-center gap-10 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
          <div className="flex flex-col items-center gap-4 text-surfaceDefault">
            <Image
              src="/logo/hp.png"
              height={190}
              width={230}
              alt="HPSDMA Logo"
              className=" object-contain "
            />
            <div className="flex flex-row items-center justify-between self-stretch">
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://hpsdma.nic.in/')
                }
              >
                <img src="/web.svg" alt="HPSDMA website link" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://hpsdma.nic.in/')
                }
              >
                <img src="/linkedin.svg" alt="HPSDMA LinkedIn link" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://x.com/hpsdma')
                }
              >
                <img src="/x.svg" alt="HPSDMA Twitter link" />{' '}
              </Button>
            </div>
          </div>
          <div className=" flex  flex-col gap-3">
            <Text
              variant="headingXl"
              fontWeight="medium"
              color="default"
              as="h3"
            >
              Himachal Pradesh State Disaster Management Authority
            </Text>

            <div className="flex flex-col gap-5">
              <div>
                <div
                  ref={descriptionRef}
                  className={!showMore ? ' line-clamp-2 lg:line-clamp-5' : ''}
                >
                  <Text variant="bodyLg" fontWeight="regular" color="default">
                    {CollaboratingPartnerHPText}
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
