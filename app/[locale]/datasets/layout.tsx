import { notFound } from 'next/navigation';

import { features } from '@/config/site';

export default function DatasetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!features.datasets) {
    notFound();
  }

  return children;
}
