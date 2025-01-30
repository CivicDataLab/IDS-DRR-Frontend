import { useState } from 'react';
import Image from 'next/image';
import { Button, Icon, Text } from 'opub-ui';

import {
  OpenContractingPartnershipTextOne,
  OpenContractingPartnershipTextTwo,
  PJMcPartnershipText,
  TheRockefellerFoundationTextOne,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';

export function SupportedBy() {
  const [showMore, setShowMore] = useState(false);
  return (
    <section
      className="flex  flex-col flex-wrap py-14 "
      aria-label="Supported by"
    >
      <div className="container mb-2 flex flex-col gap-8 ">
        <Text variant="heading2xl" fontWeight="bold" color="default" as="h2">
          Supported By
        </Text>
        <div className="flex flex-wrap items-center justify-center gap-10 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
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
              <Text variant="bodyLg" fontWeight="regular" color="default">
                {TheRockefellerFoundationTextOne}
              </Text>
              <Text variant="bodyLg" fontWeight="regular" color="default">
                For more information, sign up for their newsletter at{' '}
                <Button
                  size="large"
                  className="underline"
                  kind="tertiary"
                  variant="basic"
                  onClick={(event) =>
                    handleRedirect(event, 'https://rockefellerfoundation.org/')
                  }
                >
                  rockefellerfoundation.org
                </Button>{' '}
                and follow them on X @RockefellerFdn.
              </Text>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 bg-baseIndigoSolid1 p-9 lg:flex-nowrap ">
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
              <Text variant="bodyLg" fontWeight="regular" color="default">
                {PJMcPartnershipText}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
