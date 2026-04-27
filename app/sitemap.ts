import type { MetadataRoute } from 'next';

import { features, locales, siteUrl, states } from '@/config/site';
import { ANALYTICS_VIEWS, routes } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const activeStates = states.filter((s) => s.status === 'active');
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}${routes.home}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    });

    for (const state of activeStates) {
      for (const view of ANALYTICS_VIEWS) {
        entries.push({
          url: `${siteUrl}/${locale}${routes.analytics(state.slug, { view })}`,
          lastModified,
          changeFrequency: 'daily',
          priority: 1,
        });
      }
    }

    if (features.datasets) {
      entries.push({
        url: `${siteUrl}/${locale}${routes.datasets()}`,
        lastModified,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }

    if (features.aboutUs) {
      entries.push({
        url: `${siteUrl}/${locale}${routes.aboutUs}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
