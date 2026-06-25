import { notFound } from 'next/navigation';

import { AboutPage } from '@/config/branding';

export default function Page() {
  if (!AboutPage) notFound();
  return <AboutPage />;
}
