import { Text } from 'opub-ui';

import { aboutUsText } from '@/config/consts';

export function About() {
  return (
    <section
      className="flex h-[320px] w-full items-center  justify-center bg-backgroundSolidDark"
      aria-label="About us section heading"
    >
      <div className="container flex flex-col gap-10">
        <Text
          className=" font text-baseAmberSolid7"
          variant="heading4xl"
          fontWeight="bold"
          as="h1"
        >
          ABOUT US
        </Text>
        <Text
          variant="headingLg"
          fontWeight="regular"
          color="onBgDefault"
          as="h4"
        >
          {aboutUsText}
        </Text>
      </div>
    </section>
  );
}
