import { Text } from 'opub-ui';

import {
  IntroTextContentOne,
  IntroTextContentThree,
  IntroTextContentTwo,
} from '@/config/consts';

export const Introduction = () => {
  return (
    <section className="h-[389px] flex-wrap">
      <div className="flex h-full w-[1440px] gap-5">
        <div className="flex flex-col justify-center gap-8 ">
          <Text variant="heading2xl" fontWeight="bold" color="default">
            Introducing IDS-DRR
          </Text>
          <Text variant="bodyLg" fontWeight="regular" color="default">
            {IntroTextContentOne}
          </Text>
          <Text variant="bodyLg" fontWeight="regular" color="default">
            {IntroTextContentTwo}
          </Text>
          <Text variant="bodyLg" fontWeight="regular" color="default">
            {IntroTextContentThree}
          </Text>
        </div>
      </div>
    </section>
  );
};
