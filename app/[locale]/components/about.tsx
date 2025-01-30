import Image from 'next/image';
import Link from 'next/link';
import { Button, Text } from 'opub-ui';

import {
  AboutText,
  AboutTextContentThree,
  AboutTextContentTwo,
} from '@/config/consts';
import { handleRedirect } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import styles from './styles.module.scss';

export function About() {
  return (
    <section
      className=" h-full w-full md:p-6"
      style={{ backgroundColor: '#222136' }}
      aria-labelledby="about-section"
    >
      <div
        className="container flex flex-wrap place-content-center items-center text-surfaceDefault"
        aria-describedby="about-text-description"
      >
        <MediaRendering minWidth="1024" maxWidth={null}>
          {/* DESKTOP  */}
          <Image
            src="/logo/climateAction.png"
            width={520}
            height={500}
            objectFit="contain"
            className={styles.about__img}
            alt="An image representing global climate action"
            style={{ width: '400px', height: '469px' }}
          />
        </MediaRendering>
        <MediaRendering minWidth={null} maxWidth="1023">
          {/* MOBILE  */}
          <Image
            src="/logo/climateAction.png"
            width={250}
            height={297}
            objectFit="contain"
            className="pt-10"
            alt="An image representing global climate action"
          />
        </MediaRendering>
        <div className="flex basis-11/12 flex-col gap-5 p-4 md:basis-1/2">
          <Text
            className=" pt-3 text-baseAmberSolid7"
            variant="heading3xl"
            fontWeight="bold"
          >
            {AboutText}
          </Text>
          <Text
            className="text-surfaceDefault"
            variant="bodyLg"
            fontWeight="regular"
          >
            <Link
              href={'https://civicdatalab.in/'}
              className=" text-baseIndigoSolid1 underline"
              onClick={(event) =>
                handleRedirect(event, 'https://civicdatalab.in/')
              }
            >
              CivicDataLab
            </Link>{' '}
            along with{' '}
            <Link
              href={'https://open-contracting.org/'}
              className=" text-baseIndigoSolid1 underline"
              onClick={(event) =>
                handleRedirect(event, 'https://www.open-contracting.org/')
              }
            >
              Open Contracting Partnership
            </Link>
            , supported by
            <Button
              size="large"
              className="  text-baseIndigoSolid1 underline"
              kind="tertiary"
              onClick={(event) =>
                handleRedirect(event, 'https://www.rockefellerfoundation.org/')
              }
            >
              The Rockefeller Foundation
            </Button>{' '}
            and the{' '}
            <Button
              size="large"
              className="pl-5 text-baseIndigoSolid1 underline"
              kind="tertiary"
              onClick={(event) =>
                handleRedirect(event, 'https://www.mcgovern.org/')
              }
            >
              Patrick J McGovern Foundation,
            </Button>
            has developed a data driven framework -{' '}
            <strong>
              Intelligent Data Solution for Disaster Risk Reduction (IDS-DRR)
            </strong>
            .
          </Text>

          <Text
            className="gap-5 text-surfaceDefault"
            variant="bodyLg"
            fontWeight="regular"
          >
            {AboutTextContentTwo}
          </Text>
          <Link href={'/about-us'}>
            <Text
              variant="headingMd"
              color="onBgDefault"
              className=" underline"
            >
              Read More
            </Text>
          </Link>
        </div>
      </div>
    </section>
  );
}
