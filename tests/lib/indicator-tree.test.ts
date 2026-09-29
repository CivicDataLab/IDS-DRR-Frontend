import { type IndicatorCategory } from '@/config/graphql/analaytics-queries';
import {
  collectBranchSlugs,
  findIndicatorInCategoryTree,
  getDistinctIndicatorCategories,
  groupIndicatorsByCategory,
  isRasterAvailableForIndicator,
  shouldShowIndicatorCategories,
} from '@/lib/analytics/indicator-tree';

const tree: IndicatorCategory[] = [
  {
    slug: 'heat-risk-score',
    name: 'Overall Heat Risk',
    description: null,
    IDS_dataSpace: null,
    is_raster_available: false,
    children: [
      {
        slug: 'heat-hazard',
        name: 'Hazard',
        description: null,
        IDS_dataSpace: null,
        is_raster_available: false,
        children: [
          {
            slug: 'land-surface-temperature',
            name: 'Land Surface Temperature',
            description: null,
            IDS_dataSpace: null,
            is_raster_available: true,
          },
        ],
      },
    ],
  },
];

describe('indicator-tree', () => {
  it('finds nested indicators by slug', () => {
    expect(
      findIndicatorInCategoryTree(tree, 'land-surface-temperature')?.name
    ).toBe('Land Surface Temperature');
  });

  it('detects raster availability for leaf indicators', () => {
    expect(
      isRasterAvailableForIndicator(tree, 'land-surface-temperature')
    ).toBe(true);
    expect(isRasterAvailableForIndicator(tree, 'heat-hazard')).toBe(false);
    expect(isRasterAvailableForIndicator(tree, 'missing')).toBe(false);
  });

  it('groups indicators by category while preserving order', () => {
    const leaves: IndicatorCategory[] = [
      {
        slug: 'a',
        name: 'A',
        description: null,
        IDS_dataSpace: null,
        category: 'COPING CAPACITY',
      },
      {
        slug: 'b',
        name: 'B',
        description: null,
        IDS_dataSpace: null,
        category: 'COPING CAPACITY',
      },
      {
        slug: 'c',
        name: 'C',
        description: null,
        IDS_dataSpace: null,
        category: 'SENSITIVITY',
      },
    ];

    expect(getDistinctIndicatorCategories(leaves)).toEqual([
      'COPING CAPACITY',
      'SENSITIVITY',
    ]);
    expect(shouldShowIndicatorCategories(leaves)).toBe(true);
    expect(groupIndicatorsByCategory(leaves)).toEqual([
      {
        category: 'COPING CAPACITY',
        indicators: [leaves[0], leaves[1]],
      },
      {
        category: 'SENSITIVITY',
        indicators: [leaves[2]],
      },
    ]);
  });

  it('collects slugs for nodes that have children in the source tree', () => {
    const slugs = collectBranchSlugs(tree);

    expect(slugs.has('heat-risk-score')).toBe(true);
    expect(slugs.has('heat-hazard')).toBe(true);
    expect(slugs.has('land-surface-temperature')).toBe(false);
  });

  it('hides category labels when only one category is present', () => {
    const leaves: IndicatorCategory[] = [
      {
        slug: 'a',
        name: 'A',
        description: null,
        IDS_dataSpace: null,
        category: 'COPING CAPACITY',
      },
      {
        slug: 'b',
        name: 'B',
        description: null,
        IDS_dataSpace: null,
        category: 'COPING CAPACITY',
      },
    ];

    expect(shouldShowIndicatorCategories(leaves)).toBe(false);
  });
});
