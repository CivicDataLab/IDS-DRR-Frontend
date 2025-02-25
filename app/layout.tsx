import React from 'react';
import { Metadata } from 'next';

import '../styles/globals.css';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  other: {
    "google-site-verification":process.env.GOOGLE_SITE_VERIFICATION || ''
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
