import { getGlossaryIndex } from '@/glossary/index';
import { Text } from 'opub-ui';

import GlossaryClient from '@/components/glossary/glossary-client';
import GlossaryHeaderNav from '@/components/glossary/glossary-header-nav';

export const dynamic = 'force-static';

export default async function GlossaryPage() {
  const index = getGlossaryIndex();

  return (
    <main className="w-full bg-[#222136]">
      <div className="bg-[#222136]">
        <div className=" mx-auto mb-6 flex h-[300px] w-full max-w-6xl flex-col items-start justify-center  space-y-4 p-4 lg:p-0">
          <Text variant="heading4xl" className="text-[#FFC152]">
            Glossary
          </Text>
          <Text
            variant="headingLg"
            fontWeight="regular"
            className="text-[#fff]"
          >
            Understand key terms used across the IDS-DRR platform
          </Text>
          <GlossaryHeaderNav />
        </div>
      </div>

      <section className="min-h-[calc(100vh-400px)] w-full bg-baseGreenSolid5 p-4 lg:p-0">
        <GlossaryClient index={index} />
      </section>
    </main>
  );
}
