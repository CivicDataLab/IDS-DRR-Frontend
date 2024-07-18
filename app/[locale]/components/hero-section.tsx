import Image from 'next/image';
import { Text } from 'opub-ui';

import { HeroSectionText } from '@/config/consts';
import { deployment } from '@/config/site';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

interface ImageMap {
  [key: string]: {
    image: string;
    altText: string;
  };
}

export const HeroSection = () => {
  const ImageMap: ImageMap = {
    as: {
      image: '/logo/assamDRRLogo.svg',
      altText: 'Assam DRR Dashboard',
    },
    hp: {
      image: '/logo/hpDRRLogo.png',
      altText: 'Himachal Pradesh DRR Dashboard',
    },
  };

  return (
    <section className={cn(styles.HeroSection)}>
      <div className=" flex w-full flex-wrap items-center justify-center gap-6 bg-baseGraySlateSolid12 bg-opacity-20 p-4">
        <Image
          src={ImageMap[deployment]['image']}
          width={500}
          height={104}
          alt={ImageMap[deployment]['altText']}
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
