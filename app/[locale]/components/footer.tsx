'use client';

import Image from 'next/image';
import { Button, Text } from 'opub-ui';

import { handleRedirect } from '@/lib/utils';

export const Footer = () => {
  return (
    <footer className="flex flex-col flex-wrap gap-4 bg-backgroundSolidDark px-5 py-4 md:flex-row md:justify-between md:px-10 md:py-8">
      <div className="flex flex-row items-center gap-3">
        <Image
          src="/logo/IDS-Platform-Logo.png"
          width={245}
          height={24}
          alt="IDS-DRR Logo"
        />
        <Image src="/logo/Vector.svg" width={60} height={50} alt="Divider" />
        <div className="flex flex-row items-center gap-5">
          <Image
            src="/logo/cdlofficiallogo.png"
            width={64}
            height={64}
            alt="CivicDataLab Logo"
            className="object-contain"
          />
          <Image
            src="/logo/ocp.png"
            width={164}
            height={50}
            alt="OCP Logo"
            className="object-contain"
            style={{
              width: '164',
              height: '50',
            }}
          />
        </div>
      </div>
      <div className="text-center md:text-right">
        <Text variant="headingSmSpaced" color="onBgDefault">
          <strong>
            made with <span className=" text-baseRedSolid11">&#10084; </span> in
            india️
          </strong>
        </Text>
        <Text
          variant="bodySm"
          color="onBgDefault"
          className="mt-2 block md:mt-3"
        >
          A DataSpace product by{' '}
          <Button
            size="slim"
            className=" text-baseIndigoSolid1 underline"
            kind="tertiary"
            onClick={(event) =>
              handleRedirect(event, 'https://civicdatalab.in/')
            }
          >
            CivicDataLab
          </Button>
        </Text>
      </div>
    </footer>
  );
};
