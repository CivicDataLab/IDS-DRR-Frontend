'use server';

import { cookies } from 'next/headers';

// Server function to get google translation cookies
export const getPrefLangCookie = () => {
  return cookies().get('googtrans')?.value ?? 'en';
};
