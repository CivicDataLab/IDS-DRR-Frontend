import Image from 'next/image';
import Link from 'next/link';
import { Button, Text } from 'opub-ui';

import { AnalyticsQuickLinksText, AnalyticsURL } from '@/config/consts';
import environment from '@/config/environment';
import { deployment } from '@/config/site';
import { MediaRendering } from '@/components/media-rendering';
import NavLink from '@/components/nav-link';

export const QuickLinks = () => {
  return (
    <section className="container h-[400px] px-6 py-1">
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* DESKTOP  */}
        <div className=" flex h-full flex-wrap gap-4">
          <div className="flex flex-col justify-center gap-8 md:basis-2/6">
            <Text variant="heading3xl" fontWeight="bold" color="default">
              Analytics Dashboard
            </Text>
            <Text variant="bodyLg" fontWeight="regular" color="default">
              {AnalyticsQuickLinksText} {environment.STATE_NAME}.
            </Text>
            <NavLink href={environment.ANALYTICS_URL}>
              <Button className=" bg-[#71E57D]" variant="success" size="large">
                <Text variant="bodyLg" fontWeight="bold" color="default">
                  Explore More
                </Text>
              </Button>
            </NavLink>
          </div>
          <div className=" m-auto  hidden basis-2/6 items-center md:flex">
            <Image
              className="object-contain"
              src="/logo/analyticLinkPlaceholder2.png"
              height={252}
              width={364}
              alt="snapshot comparing risk scores across various revenue circles"
              style={{ marginTop: '-30px' }}
            />
            <Image
              src="/logo/analyticLinkPlaceholder.png"
              className="object-contain"
              height={214}
              width={330}
              alt="Map snapshot showcasing flood affected areas"
              style={{ marginLeft: '-190px', marginTop: '40px' }}
            />

            <Image
              className="object-contain"
              src="/logo/analyticLinkPlaceholder3.png"
              height={152}
              width={360}
              alt="snapshot showcasing risk scores for Mahmora revenue circle"
              style={{
                marginLeft: '-105px',
                marginBottom: '2px',
                marginTop: '14px',
              }}
            />
          </div>
        </div>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* MOBILE */}
        <div className=" flex h-full flex-wrap gap-6 ">
          <div className=" m-2 h-[120px] w-full items-center md:flex">
            <Image
              className="object-contain "
              src="/logo/analyticLinkPlaceholder2.png"
              height={240}
              width={254}
              alt="snapshot comparing risk scores across various revenue circles"
              style={{ marginTop: '-60px', marginLeft: '30px' }}
            />
            <Image
              className="object-contain "
              src="/logo/analyticLinkPlaceholder3.png"
              height={122}
              width={130}
              alt="snapshot showcasing risk scores for Mahmora revenue circle"
              style={{
                marginLeft: '-10px',
                marginBottom: '40px',
                marginTop: '-190px',
              }}
            />
            <Image
              src="/logo/analyticLinkPlaceholder.png"
              className="object-contain "
              height={144}
              width={150}
              alt="Map snapshot showcasing flood affected areas"
              style={{ marginLeft: '-10px', marginTop: '-180px' }}
            />
          </div>
          <div className="relative flex  flex-col justify-center gap-4 p-2 ">
            <Text variant="heading3xl" fontWeight="bold" color="default">
              Analytics Dashboard
            </Text>
            <Text variant="bodyLg" fontWeight="regular" color="default">
              {AnalyticsQuickLinksText}
            </Text>
            <Link href={AnalyticsURL}>
              <Button
                className=" w-[100%] bg-[#71E57D]"
                variant="success"
                size="large"
              >
                <Text variant="bodyLg" fontWeight="bold" color="default">
                  Explore More
                </Text>
              </Button>
            </Link>
          </div>
        </div>
      </MediaRendering>
    </section>
  );
};
