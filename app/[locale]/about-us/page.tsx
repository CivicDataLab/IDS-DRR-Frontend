import { notFound } from 'next/navigation';

import { AboutPage } from '@/config/site';

export default function Page() {
  if (!AboutPage) notFound();
  return <AboutPage />;
}
