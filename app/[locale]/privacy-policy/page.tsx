import { notFound } from 'next/navigation';

import { PrivacyPolicy } from '@/config/branding';

export default function Page() {
  if (!PrivacyPolicy) notFound();
  return <PrivacyPolicy />;
}
