import type { MetadataRoute } from 'next';

import { features, locales, siteUrl, states } from '@/config/site';
import { fetchDatasets } from '@/lib/api';
import { ANALYTICS_VIEWS, routes } from '@/lib/routes';
import { type JsonScalar } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  if (features.datasets) {
    let datasets: Array<{ id: string; modified?: string }> = [];
    try {
      const res = await fetchDatasets('?size=10000&page=1');
      datasets = (res?.results ?? [])
        .filter((d: JsonScalar) => d?.id)
        .map((d: JsonScalar) => ({ id: d.id, modified: d.modified }));
    } catch {
      // intentionally swallow error to not abort if the backend is unreachable
    }
    for (const locale of locales) {
      for (const { id, modified } of datasets) {
        entries.push({
          url: `${siteUrl}/${locale}${routes.datasetDetail(id)}`,
          lastModified: modified ? new Date(modified) : lastModified,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
