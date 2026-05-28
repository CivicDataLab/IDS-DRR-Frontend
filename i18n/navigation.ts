import { createNavigation } from 'next-intl/navigation';

import { defaultLocale, locales } from '@/config/site';

export const { Link, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});
