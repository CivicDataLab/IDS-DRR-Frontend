import React from 'react';
import { Metadata } from 'next';

import '../styles/globals.css';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
