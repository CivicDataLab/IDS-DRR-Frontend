import { type IndicatorCategory } from '@/config/graphql/analaytics-queries';

export function findIndicatorInCategoryTree(
  nodes: IndicatorCategory[] | undefined,
  slug: string
): IndicatorCategory | undefined {
  if (!nodes?.length) return undefined;

  for (const node of nodes) {
    if (node.slug === slug) return node;
    const match = findIndicatorInCategoryTree(node.children, slug);
    if (match) return match;
  }

  return undefined;
}

export function isRasterAvailableForIndicator(
  nodes: IndicatorCategory[] | undefined,
  slug: string
): boolean {
  return findIndicatorInCategoryTree(nodes, slug)?.is_raster_available === true;
}

export function areAllIndicatorLeaves(nodes: IndicatorCategory[]): boolean {
  return nodes.every((node) => !node.children?.length);
}

export function collectBranchSlugs(
  nodes: IndicatorCategory[] | undefined
): Set<string> {
  const slugs = new Set<string>();

  const walk = (items: IndicatorCategory[] | undefined) => {
    items?.forEach((node) => {
      if (node.children?.length) {
        slugs.add(node.slug);
        walk(node.children);
      }
    });
  };

  walk(nodes);
  return slugs;
}

export function getDistinctIndicatorCategories(
  nodes: IndicatorCategory[]
): string[] {
  return [
    ...new Set(
      nodes
        .map((node) => node.category?.trim())
        .filter((category): category is string => Boolean(category))
    ),
  ];
}

export function shouldShowIndicatorCategories(
  nodes: IndicatorCategory[]
): boolean {
  return getDistinctIndicatorCategories(nodes).length > 1;
}

export function groupIndicatorsByCategory(
  nodes: IndicatorCategory[]
): { category: string | null; indicators: IndicatorCategory[] }[] {
  const groups: {
    category: string | null;
    indicators: IndicatorCategory[];
  }[] = [];
  const groupIndex = new Map<string | null, number>();

  for (const node of nodes) {
    const key = node.category?.trim() || null;
    const existing = groupIndex.get(key);
    if (existing !== undefined) {
      groups[existing].indicators.push(node);
    } else {
      groupIndex.set(key, groups.length);
      groups.push({ category: key, indicators: [node] });
    }
  }

  return groups;
}
