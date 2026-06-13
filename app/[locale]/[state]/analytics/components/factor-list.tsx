'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'next-usequerystate';
import { useTranslations } from 'next-intl';
import { Button, Icon, Menu, Select, Text, Tooltip } from 'opub-ui';

import {
  ANALYTICS_INDICATORS_BY_CATEGORY,
  type State,
} from '@/config/graphql/analaytics-queries';
import { features } from '@/config/site';
import { GraphQL } from '@/lib/api';
import { routes } from '@/lib/routes';
import { cn, downloadStateReport } from '@/lib/utils';
import { useCopyURL } from '@/hooks/use-copy-url';
import { useStateName } from '@/hooks/use-state-name';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import { getLatestDate } from '../utils/utils';
import RadioButton from './RadioButton';
import styles from './styles.module.scss';

interface TreeNode {
  slug: string;
  name: string;
  description: string;
  children: TreeNode[];
}

interface NestedSidebarProps {
  data: TreeNode[];
  indicator: string | null;
}

function getIcon(slug: string) {
  switch (slug) {
    case 'risk-score':
      return <RiskScore color="#000000" />;
    case 'vulnerability':
      return <Vulnerability color="#000000" />;
    case 'flood-hazard':
      return <FloodHazard color="#000000" />;
    case 'exposure':
      return <Exposure color="#000000" />;
    case 'government-response':
      return <GovtResponse color="#000000" />;
    default:
      return <RiskScore color="#000000" />;
  }
}

export function FactorList({ currentState }: { currentState: State }) {
  const t = useTranslations('analytics');
  const tCommon = useTranslations('common');
  const stateName = useStateName();
  const copyURL = useCopyURL();
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const time_period = searchParams.get('time-period');
  const view = searchParams.get('view') || 'map';

  const [, setIndicatorSelected] = useQueryState('indicator');

  const currentURL = typeof window !== 'undefined' ? window.location.href : '';

  const [selectedIndicator, setSelectedIndicator] = useState(indicator || '');

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);

  const indicatorsQuery = useQuery({
    queryKey: [`indicatorsByCategory_${currentState.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY,
        {
          stateCode: currentState?.code,
        }
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const indicatorNodes = indicatorsQuery?.data?.indicatorsByCategory;

  const filteredIndicatorNodes = React.useMemo(() => {
    const filterRecursively = (nodes: TreeNode[]): TreeNode[] => {
      return nodes?.map((node) => {
        if (node.slug === 'government-response' && node.children) {
          const isMapLike = view === 'map' || view === 'table';
          const isChart = view === 'chart';

          const filteredChildren =
            isMapLike
              ? node.children.filter((child) =>
                  String(child.slug).includes('fy-cumsum')
                )
              : isChart
                ? node.children.filter(
                    (child) => !String(child.slug).includes('fy-cumsum')
                  )
                : node.children;

          return {
            ...node,
            children: filteredChildren.map((child) => ({
              ...child,
              children: child.children
                ? filterRecursively(child.children)
                : child.children,
            })),
          };
        }

        return node.children
          ? { ...node, children: filterRecursively(node.children) }
          : node;
      });
    };

    return indicatorNodes ? filterRecursively(indicatorNodes) : [];
  }, [indicatorNodes, view]);

  useEffect(() => {
    setSelectedIndicator(indicator || '');
  }, [indicator]);

  const handleChange = (selected: string) => {
    setIndicatorSelected(selected, { shallow: false });
  };

  const flattenIndicators = (
    nodes: TreeNode[],
    level = 0
  ): { label: string; value: string }[] => {
    let options: { label: string; value: string }[] = [];

    nodes?.forEach((node) => {
      options.push({
        label: `${'\u00A0'.repeat(level * 2)}${node.name}`, // Indent based on the level
        // label: node.name,
        value: node.slug,
      });

      if (node.children && node.children.length > 0) {
        options = [...options, ...flattenIndicators(node.children, level + 1)];
      }
    });

    return options;
  };

  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* MOBILE  */}

        {indicatorsQuery.isFetched && (
          <Select
            value={selectedIndicator}
            onChange={handleChange}
            label=""
            className="w-[246px] p-2"
            name="boundary-select"
            labelInline
            options={
                  indicatorsQuery.isFetched
                    ? flattenIndicators(filteredIndicatorNodes)
                    : []
            }
          />
        )}
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* DESKTOP  */}
        <div className={cn(styles.FactorList)}>
          {indicatorsQuery.isFetched && (
            <NestedSidebar
              data={filteredIndicatorNodes}
              indicator={indicator}
            />
          )}

          <hr className="m-6" />
          <div className="flex flex-col gap-4 px-6">
            <Text className="text-textSubdued" fontWeight="bold">
              {t('sidebar.actions')}
            </Text>{' '}
            <Menu
              trigger={
                <Button
                  className="self-start"
                  monochrome={true}
                  kind="tertiary"
                >
                  <div className="flex items-center gap-2">
                    <Icon source={Icons.share} />
                    <Text variant="bodyMd">{t('actions.share.label')}</Text>
                  </div>
                </Button>
              }
              items={[
                {
                  content: tCommon('social.facebook'),
                  icon: Icons.IconBrandFacebook,

                  onAction: () => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}/`;
                    if (window.confirm(tCommon('redirectConfirm', { url }))) {
                      window.open(url, '_blank');
                    }
                  },
                },
                {
                  content: tCommon('social.linkedin'),
                  icon: Icons.IconBrandLinkedin,
                  onAction: () => {
                    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${currentURL}`;
                    if (window.confirm(tCommon('redirectConfirm', { url }))) {
                      window.open(url, '_blank');
                    }
                  },
                },
                {
                  content: tCommon('social.twitter'),
                  icon: Icons.IconBrandX,
                  onAction: () => {
                    const url = `https://twitter.com/intent/tweet?url=${currentURL}/`;
                    if (window.confirm(tCommon('redirectConfirm', { url }))) {
                      window.open(url, '_blank');
                    }
                  },
                },
                {
                  content: tCommon('copy.trigger'),
                  icon: Icons.link,
                  onAction: () => copyURL(),
                },
              ]}
            />
            {features.reports &&
              (downloadReportLoading ? (
                <Icon
                  source={Icons.loader}
                  data-testid="loader-icon"
                  className="animate-spin"
                />
              ) : (
                <Button
                  className="self-start"
                  onClick={async () => {
                    const confirmation = window.confirm(
                      t('actions.download.confirm', { name: stateName(currentState.slug, currentState.name) })
                    );
                    if (confirmation) {
                      try {
                        if (!time_period) {
                          throw new Error('Time period is not defined');
                        }

                        const time_period_array = time_period?.split(
                          ','
                        ) as string[];

                        let time_period_latest;

                        if (time_period_array?.length > 1) {
                          const time_period_latest_date = new Date(
                            getLatestDate(time_period_array) as string
                          );
                          time_period_latest =
                            `${time_period_latest_date.getFullYear()}_${String(time_period_latest_date.getMonth() + 1).padStart(2, '0')}` as string;
                        } else {
                          time_period_latest = time_period;
                        }

                        setDownloadReportLoading(true);
                        await downloadStateReport(
                          routes.report(currentState.code, time_period_latest),
                          `${currentState.name}-Report`
                        );
                      } catch (error) {
                        alert(t('actions.download.error', { error: String(error) }));
                      } finally {
                        setDownloadReportLoading(false);
                      }
                    }
                  }}
                  monochrome={true}
                  kind="tertiary"

                  // disabled={downloadReportLoading}
                >
                  <div className="flex items-center gap-2">
                    <Icon source={Icons.download} />

                    <Text variant="bodyMd">{t('actions.download.label')}</Text>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      </MediaRendering>
    </>
  );
}

const NestedSidebarItem: React.FC<{
  node: TreeNode;
  level: number;
  indicator: string | null;
}> = ({ node, level, indicator }) => {
  const [isExpanded, setIsExpanded] = useState(node.slug === 'risk-score');
  const [, setIndicatorSelected] = useQueryState('indicator');
  const isActive = node.slug === indicator;
  const hasChildren = node.children && node.children.length > 0;
  useEffect(() => {
    if (node.slug === indicator) {
      setIsExpanded(true);
    }
  }, [indicator, node.slug]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn('relative', level === 0 && 'pl-4')}>
      <div
        className={cn(
          'flex cursor-pointer items-center py-1',
          'font-Bold',
          level > 1 && 'pl-6'
        )}
        role="button"
        tabIndex={0}
        aria-label={node.name}
      >
        {level < 2 ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setIsExpanded(true);
              setIndicatorSelected(node.slug, { shallow: false });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                setIsExpanded(true);
              }
            }}
            className={cn(
              'group flex h-10 w-full items-center gap-4',
              isActive && 'px-2',
              isActive && 'bg-[#96e79eb2]'
            )}
          >
            <div className="relative">
              <div className="group-hover:hidden">{getIcon(node.slug)}</div>
              <div className="hidden group-hover:block">
                <Button
                  monochrome={true}
                  kind="tertiary"
                  onClick={toggleExpand}
                >
                  {isExpanded ? (
                    <Icon source={Icons.up} />
                  ) : (
                    <Icon source={Icons.down} />
                  )}
                </Button>
              </div>
            </div>
            <Tooltip content={node.description}>
              <Text fontWeight="semibold">{node.name}</Text>
            </Tooltip>
          </div>
        ) : (
          <Tooltip content={node.description}>
            <RadioButton
              id={`radio-${node.slug}`}
              isSelected={indicator === node.slug}
              changed={(value: string) => {
                setIndicatorSelected(value, { shallow: false });
              }}
              label={node.name}
              value={node.slug}
            />
          </Tooltip>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className={cn('relative', level === 0 && 'ml-4')}>
          {node.children.map((child) => (
            <NestedSidebarItem
              key={child.slug}
              node={child}
              indicator={indicator}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NestedSidebar: React.FC<NestedSidebarProps> = ({ data, indicator }) => {
  return (
    <div>
      {data?.map((node) => (
        <NestedSidebarItem
          key={node.slug}
          node={node}
          indicator={indicator}
          level={0}
        />
      ))}
    </div>
  );
};
