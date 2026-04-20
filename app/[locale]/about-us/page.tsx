import { notFound } from 'next/navigation';

export default async function Page() {
  const { AboutPage } = await import('ids-drr-branding');
  if (!AboutPage) notFound();
  return <AboutPage />;
}
