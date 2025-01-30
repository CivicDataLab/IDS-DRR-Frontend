import React, { useMemo } from 'react';
import { Spinner, Table, Text } from 'opub-ui';

import { Factors, RiskText } from '@/config/consts';
import { formatNumberToIndianSystem } from '../utils/utils';

type ColumnDefinition = {
  accessorKey: string;
  header: string;
  id?: string;
};

export function TableComponent({ data, isLoading }: any) {
  const BOUNDARY_MAP: { DISTRICT: string; 'REVENUE CIRCLE': string } = {
    DISTRICT: 'District',
    'REVENUE CIRCLE': 'Revenue Circle',
  };

  function transformColumnData(data: ColumnDefinition[]) {
    const transformed: { accessorKey: string; header: any; id?: string }[] = [];
    // Add district column
    transformed.push(
      {
        accessorKey: 'region-name',
        header: 'Region Name',
      },
      {
        accessorKey: 'region-type',
        header: 'Region Boundary',
      }
    );

    // Dynamically transform other properties
    Object.entries(data).forEach(([key, item]) => {
      if (typeof item === 'object' && 'value' in item && 'title' in item) {
        transformed.push({
          accessorKey: key,
          id: key,
          header: item.title,
        });
      }
    });

    return transformed;
  }

  function transformRowData(data: Record<string, any>[]) {
    const rows = data?.map((item) => {
      const row: Record<string, any> = {};
      row['region-name'] = item['region-name'] as string;
      row['region-type'] = BOUNDARY_MAP[item.type as keyof typeof BOUNDARY_MAP];
      Object.keys(item).forEach((key) => {
        const value = item[key];
        if (value !== null && typeof value === 'object' && 'value' in value) {
          row[key] = Factors.includes(key)
            ? RiskText[parseInt((value as { value: string }).value)][
                'indicatorText'
              ]
            : formatNumberToIndianSystem(
                (value as { value: any }).value
              ).toString();
        }
      });
      return row;
    });
    return rows;
  }

  const columns = useMemo(() => {
    return data?.length ? transformColumnData(data[0]) : [];
  }, [data]);

  const rows = useMemo(() => {
    return data?.length ? transformRowData(data) : [];
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[100vh] flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>Loading...</Text>
      </div>
    );
  }

  if (!data || rows.length === 0 || columns.length === 0) {
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Text>No data available.</Text>
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
      />
    </div>
  );
}
