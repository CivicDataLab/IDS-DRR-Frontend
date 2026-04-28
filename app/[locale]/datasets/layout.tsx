import { notFound } from 'next/navigation';

export default function DatasetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    notFound();
  }

  return children;
}
