import React from 'react';
import { BarChart } from 'opub-ui/viz';

import { formatDateString } from '@/lib/utils';

interface LineOptions {
  xAxis: {
    data: string[];
    name: string;
  };
  yAxis: {
    type: string;
    minInterval: number;
    min: number;
    max: number;
    name: string;
  };
  legend: {
    data: string[];
  };
  series: {
    data: number[];
    type: string;
    name: string;
    color: string;
  }[];
}

export function TimeTrends({
  chartData,
  indicator,
  boundary,
}: {
  chartData: any;
  indicator: string;
  boundary: string;
}) {
  let lineOptions: LineOptions = {
    xAxis: {
      data: Object.keys(chartData[indicator]).map((item) =>
        formatDateString(item)
      ),
      name: 'Month',
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      min: 0,
      max: 5,
      name: 'Risk Level',
    },
    legend: {
      data: [],
    },
    series: [],
  };

  let boundaryNames: any = [];
  Object.values(chartData[indicator]).forEach((item: any) => {
    item.forEach((d: any) => {
      if (!boundaryNames.includes(d[boundary])) {
        boundaryNames.push(d[boundary]);
      }
    });
  });

  const color = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ];

  // Create series for each district
  boundaryNames.forEach((name: any, index: any) => {
    let seriesData = Object.keys(chartData[indicator]).map((key: any) => {
      let value = chartData[indicator][key].find(
        (item: any) => item[boundary] === name
      );
      return value ? value[indicator] : 0;
    });

    lineOptions.legend.data.push(boundary);

    lineOptions.series.push({
      data: seriesData,
      type: 'line',
      name: boundary,
      color: color[index],
    });
  });

  return (
    <div className="mt-4">
      <BarChart options={lineOptions} height="400px" showLabel={true} />
    </div>
  );
}
