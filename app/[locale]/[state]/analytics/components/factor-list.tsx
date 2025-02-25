import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/public/FactorIcons';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'next-usequerystate';
import { Button, Icon, Menu, Select, Text, Tooltip } from 'opub-ui';

import { ANALYTICS_INDICATORS_BY_CATEGORY } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn, copyCurrentURL, downloadStateReport } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
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

export function getIcon(slug: string) {
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

export function FactorList({ currentState }: any) {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const [, setIndicatorSelected] = useQueryState('indicator');

  const currentURL = typeof window !== 'undefined' ? window.location.href : '';

  const [selectedIndicator, setSelectedIndicator] = useState(indicator || '');

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);

  const indicatorsQuery = useQuery(
    [`indicatorsByCategory_${currentState.code}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY,
        {
          stateCode: currentState?.code,
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const indicatorNodes = indicatorsQuery?.data?.indicatorsByCategory;

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
              indicatorsQuery.isFetched ? flattenIndicators(indicatorNodes) : []
            }
          />
        )}
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* DESKTOP  */}
        <div className={cn(styles.FactorList)}>
          {indicatorsQuery.isFetched && (
            <NestedSidebar data={indicatorNodes} indicator={indicator} />
          )}

          <hr className="m-6" />
          <div className="flex flex-col gap-4 px-6">
            <Text className="text-textSubdued" fontWeight="bold">
              ACTIONS
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
                    <Text variant="bodyMd">Share</Text>
                  </div>
                </Button>
              }
              items={[
                {
                  content: 'Facebook',
                  icon: Icons.IconBrandFacebook,

                  onAction: () => {
                    const confirmation = window.confirm(
                      `You are being redirected to "${`https://www.facebook.com/sharer/sharer.php?u=${currentURL}/`}". `
                    );
                    if (confirmation) {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${currentURL}/`,
                        '_blank'
                      );
                    }
                  },
                },
                {
                  content: 'LinkedIn',
                  icon: Icons.IconBrandLinkedin,
                  onAction: () => {
                    const confirmation = window.confirm(
                      `You are being redirected to "${`https://www.linkedin.com/feed/?shareActive=true&text=${currentURL}`}`
                    );
                    if (confirmation) {
                      window.open(
                        `https://www.linkedin.com/feed/?shareActive=true&text=${currentURL}`,
                        '_blank'
                      );
                    }
                  },
                },
                {
                  content: 'Twitter',
                  icon: Icons.IconBrandX,
                  onAction: () => {
                    const confirmation = window.confirm(
                      `You are being redirected to "${`https://twitter.com/intent/tweet?url=${currentURL}/`}". `
                    );
                    if (confirmation) {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${currentURL}/`,
                        '_blank'
                      );
                    }
                  },
                },
                {
                  content: 'Copy Link',
                  icon: Icons.link,
                  onAction: () => copyCurrentURL(),
                },
              ]}
            />
            {downloadReportLoading ? (
              <Icon source={Icons.loader} className="animate-spin" />
            ) : (
              <Button
                className="self-start"
                onClick={async () => {
                  const confirmation = window.confirm(
                    `Do you want to download the report for "${currentState.name}"?`
                  );
                  if (confirmation) {
                    try {
                      setDownloadReportLoading(true);
                      await downloadStateReport(
                        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/report?geo_code=${currentState.code}`,
                        `${currentState.name}-Report`
                      );
                    } catch (error) {
                      alert(`Error Downloading Report. ${error}`);
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

                  <Text variant="bodyMd">Download Report</Text>
                </div>
              </Button>
            )}
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
      {data.map((node) => (
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
