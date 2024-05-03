import Image from 'next/image';
import { Button, Icon, Text } from 'opub-ui';

import {
  OpenContractingPartnershipTextOne,
  OpenContractingPartnershipTextTwo,
  TheRockefellerFoundationTextOne,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';

export function SupportedBy() {
  return (
    <section className="flex  flex-col flex-wrap py-14 ">
      <div className="container mb-2 flex flex-col gap-8 ">
        <Text variant="heading2xl" fontWeight="bold" color="default">
          Supported By
        </Text>
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
      </div>
    </section>
  );
}
