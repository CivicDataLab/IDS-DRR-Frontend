import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ProgressBar,
  Text,
  Tooltip,
} from 'opub-ui';

import { RiskColorMap } from '@/config/consts';
import { deSlugify } from '@/lib/utils';
import { getFactorNameBySlug } from './output-window';

interface RevenueProps {
  factorData: any;
  revenueCircleData: any;
  indicator: string;
}

export const RevenueCircle = ({
  factorData,
  revenueCircleData,
  indicator,
}: RevenueProps) => {
  const clonedRevenueCircleData = structuredClone(revenueCircleData[0]);
  delete clonedRevenueCircleData['revenue circle'];
  delete clonedRevenueCircleData['revenue-circle-code'];
  delete clonedRevenueCircleData[indicator];

  const FactorVariables = Object.keys(clonedRevenueCircleData);

  return (
    <Accordion type="single" defaultValue={`revenue-circle-0`} collapsible>
      {revenueCircleData.map((item: any, index: number) => (
        <AccordionItem
          key={`revenue-circle-${index}`}
          value={`revenue-circle-${index}`}
          className="border-none"
        >
          <div className="flex items-center gap-3">
            <Text
              variant="headingMd"
              fontWeight="regular"
              className=" basis-4/6"
            >
              {item?.['revenue circle']}
            </Text>
            <ProgressBar
              size="small"
              customColor={RiskColorMap[parseInt(item?.[indicator]['value'])]}
              value={(parseInt(item?.[indicator]['value']) / 5) * 100}
            />
            <Tooltip
              content={
                <div className="flex flex-col px-2 py-1">
                  <Text variant="headingXl">
                    {parseInt(item?.[indicator]['value'])} / 5{' '}
                  </Text>
                  <Text>HIGH RISK</Text>
                </div>
              }
            >
              <AccordionTrigger />
            </Tooltip>
          </div>

          <AccordionContent className="px-3 pb-4 md:px-6">
            {FactorVariables.map(
              (scoreType) =>
                item?.[scoreType] !== undefined && (
                  <ScoreInfo
                    key={scoreType}
                    indicator={indicator}
                    label={
                      indicator === 'risk-score'
                        ? getFactorNameBySlug(factorData, scoreType)
                        : item?.[scoreType]['title']
                    }
                    value={item?.[scoreType]['value']}
                    scoreType={scoreType}
                  />
                )
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface ScoreProps {
  label: string;
  value: string;
  indicator: string;
  scoreType?: string;
}

export const ScoreInfo = ({
  label,
  value,
  indicator,
  scoreType,
}: ScoreProps) => {
  const searchParams = useSearchParams();
  const time_period = searchParams.get('time-period') || '2023_08';
  const boundary = searchParams.get('boundary') || 'district';
  const region = searchParams.get('region') || '';
  return (
    <div className="mt-2">
      {indicator === 'risk-score' ? (
        <Link
          href={`?indicator=${scoreType}&time-period=${time_period}&boundary=${boundary}&region=${region}`}
        >
          <Text color="interactive">{label}</Text>
        </Link>
      ) : (
        <span>{label}</span>
      )}
      :{' '}
      {indicator === 'risk-score' ? (
        <strong className="pl-2">{parseInt(value)}/5</strong>
      ) : (
        <strong className="pl-2">{value}</strong>
      )}
    </div>
  );
};
