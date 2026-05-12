import { notFound } from 'next/navigation';
import { getGlossaryIndex } from '@/glossary/index';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Text } from 'opub-ui';

import { features } from '@/config/site';
import GlossaryClient from '@/components/glossary/glossary-client';
import GlossaryHeaderNav from '@/components/glossary/glossary-header-nav';

export const dynamic = 'force-static';

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!features.glossary) notFound();

  const t = await getTranslations({ locale, namespace: 'glossary' });
  const index = getGlossaryIndex();

  return (
    <main className="w-full bg-[#222136]">
      <div className="bg-[#222136]">
        <div className=" mx-auto mb-6 flex h-[300px] w-full max-w-6xl flex-col items-start justify-center  space-y-4 p-4 lg:p-0">
          <Text variant="heading4xl" className="text-[#FFC152]">
            {t('heading')}
          </Text>
          <Text
            variant="headingLg"
            fontWeight="regular"
            className="text-[#fff]"
          >
            {t('description')}
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
