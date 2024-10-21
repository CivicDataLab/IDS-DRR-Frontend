import Image from 'next/image';
import { Text } from 'opub-ui';

import { HeroSectionText } from '@/config/consts';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

export const HeroSection = () => {
  return (
    <section className={cn(styles.HeroSection)}>
      <div className=" container flex h-full w-full flex-col items-center justify-end self-center py-14">
        <Image
          src="/logo/IDS-yellow.png"
          width={741}
          height={84}
          alt="Assam DRR Dashboard"
          className=" hidden lg:block"
        />
        <Image
          src="/logo/IDS-yellow.png"
          width={360}
          height={56}
          alt="Assam DRR Dashboard"
          className=" block lg:hidden"
        />
        <Text
          className="pt-4 text-center text-surfaceDefault"
          fontWeight="medium"
          variant="headingMd"
        >
          {HeroSectionText}
        </Text>
      </div>
    </section>
  );
};
