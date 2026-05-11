import { notFound } from 'next/navigation';
<<<<<<< HEAD
import { getGlossaryIndex } from '@/glossary/index';
import {
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { Text } from 'opub-ui';

import { features } from '@/config/site';
=======
import { getTranslations } from 'next-intl/server';
import { Text } from 'opub-ui';

import { features } from '@/config/site';
import { getGlossaryIndex } from '@/glossary/index';
>>>>>>> edaa4d9 (i18n: Extract text into messages)
import GlossaryClient from '@/components/glossary/glossary-client';
import GlossaryHeaderNav from '@/components/glossary/glossary-header-nav';

export const dynamic = 'force-static';

<<<<<<< HEAD
export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!features.glossary) notFound();

  const t = await getTranslations({ locale, namespace: 'glossary' });
=======
export default async function GlossaryPage() {
  if (!features.glossary) notFound();
  const t = await getTranslations('glossary');
>>>>>>> edaa4d9 (i18n: Extract text into messages)
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
