import { useTranslations } from 'next-intl';

import { copyToClipboard } from '@/lib/utils';

export function useCopyURL() {
  const t = useTranslations('common.copy');
  return async (url?: string) => {
    const ok = await copyToClipboard(url ?? window.location.href);
    alert(ok ? t('success') : t('error'));
  };
}
