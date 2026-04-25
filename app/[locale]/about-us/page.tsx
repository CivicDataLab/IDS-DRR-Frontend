import { AboutPage } from 'ids-drr-branding';
import { notFound } from 'next/navigation';

export default function Page() {
  if (!AboutPage) notFound();
  return <AboutPage />;
}
