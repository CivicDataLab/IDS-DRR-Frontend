import Image from 'next/image';
import { Text } from 'opub-ui';

import { HeroSectionText } from '@/config/consts';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  return (
    <section className={cn(styles.HeroSection)}>
      <div className=" flex w-full flex-wrap items-center justify-center gap-6 bg-baseGraySlateSolid12 bg-opacity-20 p-4">
        <div></div>
        <Image
          src="/logo/assamDRRLogo.svg"
          width={400}
          height={104}
          alt="Assam DRR Dashboard"
        />

        <Text
          className="p-4 text-surfaceDefault md:basis-1/2"
          variant="headingXl"
          fontWeight="medium"
        >
          {HeroSectionText}
        </Text>
      </div>
    </section>
  );
};
