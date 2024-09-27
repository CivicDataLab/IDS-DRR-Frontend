import { useState } from 'react';
import Image from 'next/image';
import { Button, Icon, Text } from 'opub-ui';

import {
  OpenContractingPartnershipTextOne,
  OpenContractingPartnershipTextTwo,
  TheRockefellerFoundationTextOne,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';

export function SupportedBy() {
  const [showMore, setShowMore] = useState(false);
  return (
    <section className="flex  flex-col flex-wrap py-14 ">
      <div className="container mb-2 flex flex-col gap-8 ">
        <Text variant="heading2xl" fontWeight="bold" color="default">
          Supported By
        </Text>
        <MediaRendering minWidth="1024" maxWidth={null}>
          {/* DESKTOP  */}
          <div className="flex h-full flex-wrap  items-center gap-10 bg-baseIndigoSolid1 p-9 ">
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
                  <Icon source={Icons.IconWorld} />
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
                  <Icon source={Icons.IconBrandLinkedin} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://twitter.com/rockefellerfdn')
                  }
                >
                  <Icon source={Icons.IconBrandX} />
                </Button>
              </div>
            </div>
            <div className=" flex  basis-3/4 flex-col gap-3">
              <Text variant="headingXl" fontWeight="medium" color="default">
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
                      handleRedirect(
                        event,
                        'https://rockefellerfoundation.org/'
                      )
                    }
                  >
                    rockefellerfoundation.org
                  </Button>{' '}
                  and follow them on X @RockefellerFdn.
                </Text>
              </div>
            </div>
          </div>
          <div className="flex  h-full flex-wrap items-center gap-10 bg-baseIndigoSolid1 p-9 ">
            <div className="flex flex-col items-center gap-4 text-surfaceDefault">
              <Image
                src="/logo/OpenContracting.png"
                height={190}
                width={230}
                alt="Open Contracting Partnership Logo"
                className=" object-contain "
              />
              <div className="flex flex-row items-center justify-between self-stretch">
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://www.open-contracting.org/')
                  }
                >
                  <Icon source={Icons.IconWorld} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(
                      event,
                      'https://www.linkedin.com/company/opencontractingpartnership'
                    )
                  }
                >
                  <Icon source={Icons.IconBrandLinkedin} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://twitter.com/opencontracting')
                  }
                >
                  <Icon source={Icons.IconBrandX} />
                </Button>
              </div>
            </div>
            <div className=" flex basis-3/4 flex-col gap-3">
              <Text variant="headingXl" fontWeight="medium" color="default">
                Open Contracting Partnership
              </Text>
              <div className="flex flex-col gap-5">
                <Text variant="bodyLg" fontWeight="regular" color="default">
                  {OpenContractingPartnershipTextOne}
                </Text>
                <Text variant="bodyLg" fontWeight="regular" color="default">
                  {OpenContractingPartnershipTextTwo}
                </Text>
              </div>
            </div>
          </div>
        </MediaRendering>
        <MediaRendering minWidth={null} maxWidth="1023">
          {/* MOBILE  */}
          <div className="flex h-full flex-wrap  items-center gap-10 bg-baseIndigoSolid1 p-9 ">
            <div className="flex w-[278px] flex-col items-center gap-4 text-surfaceDefault">
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
                  <Icon source={Icons.IconWorld} />
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
                  <Icon source={Icons.IconBrandLinkedin} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://twitter.com/rockefellerfdn')
                  }
                >
                  <Icon source={Icons.IconBrandX} />
                </Button>
              </div>
            </div>
            <div className=" flex w-[278px]  flex-col gap-3">
              <Text variant="headingXl" fontWeight="medium" color="default">
                The Rockefeller Foundation
              </Text>
              <div className="flex flex-col gap-5">
                <Text
                  variant="bodyLg"
                  fontWeight="regular"
                  color="default"
                  className={`mb-0 mt-3 ${!showMore ? 'line-clamp-3' : ''}`}
                >
                  {TheRockefellerFoundationTextOne}
                  <br />
                  <br />
                  For more information, sign up for their newsletter at
                  <Button
                    size="large"
                    className="underline"
                    kind="tertiary"
                    variant="basic"
                    onClick={(event) =>
                      handleRedirect(
                        event,
                        'https://rockefellerfoundation.org/'
                      )
                    }
                  >
                    rockefellerfoundation.org
                  </Button>
                  and follow them on X @RockefellerFdn.
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
          <div className="flex  h-full flex-wrap items-center gap-10 bg-baseIndigoSolid1 p-9 ">
            <div className="flex w-[278px]  flex-col items-center gap-4 text-surfaceDefault">
              <Image
                src="/logo/OpenContracting.png"
                height={190}
                width={230}
                alt="Open Contracting Partnership Logo"
                className=" object-contain "
              />
              <div className="flex flex-row items-center justify-between self-stretch">
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://www.open-contracting.org/')
                  }
                >
                  <Icon source={Icons.IconWorld} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(
                      event,
                      'https://www.linkedin.com/company/opencontractingpartnership'
                    )
                  }
                >
                  <Icon source={Icons.IconBrandLinkedin} />
                </Button>
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={(event) =>
                    handleRedirect(event, 'https://twitter.com/opencontracting')
                  }
                >
                  <Icon source={Icons.IconBrandX} />
                </Button>
              </div>
            </div>
            <div className=" flex  w-[278px] flex-col gap-3">
              <Text variant="headingXl" fontWeight="medium" color="default">
                Open Contracting Partnership
              </Text>
              <div className="flex flex-col gap-5">
                <Text
                  variant="bodyLg"
                  fontWeight="regular"
                  color="default"
                  className={`mb-0 mt-3 ${!showMore ? 'line-clamp-3' : ''}`}
                >
                  {OpenContractingPartnershipTextOne}
                  <br />
                  <br />
                  {OpenContractingPartnershipTextTwo}
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
