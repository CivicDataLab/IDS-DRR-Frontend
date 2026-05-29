import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Spinner, Table, Text } from 'opub-ui';

import { useFormatNumber } from '@/hooks/use-format-number';
import { Factors } from '@/lib/analytics';

export function TableComponent({ data, isLoading }: any) {
  const t = useTranslations('analytics.table');
  const tCommon = useTranslations('common');
  const tRisk = useTranslations('analytics.risk');
  const formatNumber = useFormatNumber();
  const columns = useMemo(() => {
    if (!data?.length) return [];
    // Add district column
    const transformed: { accessorKey: string; header: any; id?: string }[] = [
      {
        accessorKey: 'region-name',
        header: t('regionName'),
      },
      {
        accessorKey: 'region-type',
        header: t('regionBoundary'),
      }
    ];
    // Dynamically transform other properties
    Object.entries(data[0]).forEach(([key, item]) => {
      if (
        typeof item === 'object' &&
        item !== null &&
        'value' in item &&
        'title' in item
      ) {
        transformed.push({
          accessorKey: key,
          id: key,
          header: item.title,
        });
      }
    });

    return transformed;
  }, [data, t]);

  const labels = useMemo(
    () => ({
      rows: t('labels.rows'),
      pageIndex: (current: number, total: number) =>
        t('labels.pageIndex', { current, total }),
      pageIndexMobile: (current: number, total: number) =>
        t('labels.pageIndexMobile', { current, total }),
      firstPage: t('labels.firstPage'),
      previousPage: t('labels.previousPage'),
      nextPage: t('labels.nextPage'),
      lastPage: t('labels.lastPage'),
    }),
    [t]
  );

  const rows = useMemo(() => {
    if (!data?.length) return [];
    return data.map((item: Record<string, any>) => {
      const row: Record<string, any> = {};
      row['region-name'] = item['region-name'] as string;
      row['region-type'] = item.type;
      Object.keys(item).forEach((key) => {
        const value = item[key];
        if (value !== null && typeof value === 'object' && 'value' in value) {
          row[key] = Factors.includes(key)
            ? tRisk(String(parseInt((value as { value: string }).value)) as RiskLevel)
            : formatNumber((value as { value: any }).value).toString();
        }
      });
      return row;
    });
  }, [data, formatNumber, tRisk]);

  if (isLoading) {
    return (
      <div className="flex h-[100vh] flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>{tCommon('loading')}</Text>
      </div>
    );
  }

  if (!data || rows.length === 0 || columns.length === 0) {
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Text>{t('empty')}</Text>
      </div>
    );
  }

  return (
    <div className="max-h-svh p-4">
      <Table
        key={JSON.stringify(rows)}
        truncate
        columns={columns}
        theme="climate"
        hasZebraStripingOnData
        sortColumns={columns.map((column) => column.accessorKey)}
        rows={rows}
        labels={labels}
      />
    </div>
  );
}
