import { Text } from 'opub-ui';

import {
  IntroTextContentOne,
  IntroTextContentThree,
  IntroTextContentTwo,
} from '@/config/consts';

export const Introduction = () => {
  return (
    <section>
      <div className="container flex h-full gap-5 py-8">
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
