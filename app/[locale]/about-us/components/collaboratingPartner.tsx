import { useState } from 'react';
import Image from 'next/image';
import { Button, Icon, Text } from 'opub-ui';

import {
  CollaboratingPartnerTextOne,
  CollaboratingPartnerTextTwo,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';

export function CollaboratingPartner() {
  const [showMore, setShowMore] = useState(false);
  return (
    <section className="flex h-full flex-col flex-wrap py-14 ">
      <div className="container flex flex-col gap-8">
        <Text variant="heading2xl" fontWeight="bold" color="default">
          Collaborating partner
        </Text>
        <MediaRendering minWidth="1024" maxWidth={null}>
          {/* DESKTOP  */}
          <div className="flex h-full basis-1/3 flex-wrap items-center gap-10 bg-baseIndigoSolid1 p-9 ">
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
                  <Icon source={Icons.IconWorld} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://asdma.assam.gov.in/')
                  }
                >
                  <Icon source={Icons.IconBrandLinkedin} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://x.com/sdma_assam')
                  }
                >
                  <Icon source={Icons.IconBrandX} />
                </Button>
              </div>
            </div>
            <div className=" flex basis-3/4 flex-col gap-3">
              <Text variant="headingXl" fontWeight="medium" color="default">
                Assam State Disaster Management Authority
              </Text>

              <div className="flex flex-col gap-5">
                <Text variant="bodyLg" fontWeight="regular" color="default">
                  {CollaboratingPartnerTextOne}
                </Text>
                <Text variant="bodyLg" fontWeight="regular" color="default">
                  {CollaboratingPartnerTextTwo}
                </Text>
              </div>
            </div>
          </div>
        </MediaRendering>
        <MediaRendering minWidth={null} maxWidth="1023">
          {/* mobile */}
          <div className="flex  h-full basis-1/3 flex-wrap items-center gap-10 bg-baseIndigoSolid1 p-9 ">
            <div className="flex w-[278px] flex-col items-center gap-4 text-surfaceDefault">
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
                  <Icon source={Icons.IconWorld} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://asdma.assam.gov.in/')
                  }
                >
                  <Icon source={Icons.IconBrandLinkedin} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://x.com/sdma_assam')
                  }
                >
                  <Icon source={Icons.IconBrandX} />
                </Button>
              </div>
            </div>
            <div className=" flex w-[278px] basis-3/4 flex-col gap-3">
              <Text variant="headingXl" fontWeight="medium" color="default">
                Assam State Disaster Management Authority
              </Text>

              <div className="flex w-[278px] flex-col gap-5">
                <Text
                  variant="bodyLg"
                  fontWeight="regular"
                  color="default"
                  className={`mb-0 mt-3 ${!showMore ? 'line-clamp-3' : ''}`}
                  // truncate={!showMore}
                >
                  {CollaboratingPartnerTextOne}
                  <br />
                  <br />
                  {CollaboratingPartnerTextTwo}
                </Text>

                {!showMore && (
                  <Button
                    className=" self-start p-2"
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
                    className="self-start p-2"
                    onClick={() => setShowMore(false)}
                    variant="interactive"
                    size="slim"
                    kind="tertiary"
                  >
                    Show less
                  </Button>
                )}
              </div>
            </div>
          </div>
        </MediaRendering>
      </div>
    </section>
  );
}
