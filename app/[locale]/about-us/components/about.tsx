import { Text } from 'opub-ui';

import { aboutUsText } from '@/config/consts';

export function About() {
  return (
    <section className="flex h-[319px] w-full items-center  justify-center bg-backgroundSolidDark">
      <div className="flex w-[1440px] flex-col gap-10">
        <Text
          className=" font text-baseAmberSolid7"
          variant="heading4xl"
          fontWeight="bold"
        >
          ABOUT US
        </Text>
        <Text variant="headingLg" fontWeight="regular" color="onBgDefault">
          {aboutUsText}
        </Text>
      </div>
    </section>
  );
}
