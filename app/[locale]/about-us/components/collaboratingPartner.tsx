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
                <img src="/web.svg" alt="web" />
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://asdma.assam.gov.in/')
                }
              >
                <img src="/linkedin.svg" alt="linkedin" />{' '}
              </Button>
              <Button
                monochrome={true}
                kind="tertiary"
                onClick={(event) =>
                  handleRedirect(event, 'https://x.com/sdma_assam')
                }
              >
                <img src="/x.svg" alt="x" />{' '}
              </Button>
            </div>
          </div>
          <div className=" flex  flex-col gap-3">
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
      </div>
    </section>
  );
}
