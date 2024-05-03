import Image from 'next/image';
import { Text } from 'opub-ui';

import {
  AboutText,
  AboutTextContentOne,
  AboutTextContentThree,
  AboutTextContentTwo,
} from '@/config/consts';
import styles from './styles.module.scss';

export function About() {
  return (
    <section className="flex h-full w-full bg-backgroundSolidDark md:p-6">
      <div className="flex flex-wrap place-content-center items-center text-surfaceDefault">
        <Image
          src="/logo/climateAction.png"
          width={520}
          height={500}
          objectFit="contain"
          className={styles.about__img}
          alt="An image representing global climate action"
        />
        <div className="flex basis-11/12 flex-col gap-5 p-4 md:basis-1/2">
          <Text
            className=" text-baseAmberSolid7"
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
            {AboutTextContentOne}
          </Text>

          <Text
            className="gap-5 text-surfaceDefault"
            variant="bodyLg"
            fontWeight="regular"
          >
            {AboutTextContentTwo}
          </Text>

          <Text
            className="gap-5 text-surfaceDefault"
            variant="bodyLg"
            fontWeight="regular"
          >
            {AboutTextContentThree}
          </Text>
        </div>
      </div>
    </section>
  );
}
