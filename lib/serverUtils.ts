'use server';

import { cookies } from 'next/headers';

// Server function to get google translation cookies
export const getPrefLangCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('googtrans')?.value ?? 'en';
};
