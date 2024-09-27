import Image from 'next/image';
import { Text } from 'opub-ui';

import { HeroSectionText } from '@/config/consts';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  return (
    <section className={cn(styles.HeroSection)}>
      <div className=" container flex h-full w-full flex-col justify-end self-start py-14">
        <Image
          src="/logo/IDS-yellow.png"
          width={380}
          height={56}
          alt="Assam DRR Dashboard"
        />
        <Text
          className=" max-w-96 pt-4 text-surfaceDefault"
          variant="headingXl"
          fontWeight="medium"
        >
          {HeroSectionText}
        </Text>
      </div>
    </section>
  );
};
