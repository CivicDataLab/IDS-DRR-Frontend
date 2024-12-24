import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { InfoSquare } from '@/public/InfoCircle';
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
import {
  formatNumberToIndianSystem,
  getFactorNameBySlug,
} from '../utils/utils';

interface RevenueProps {
  factorData: any;
  revenueCircleData: any;
  indicator: string;
  indicatorDescriptions: any;
  getDescription: any;
}

export const RevenueCircle = ({
  factorData,
  revenueCircleData,
  indicator,
  indicatorDescriptions,
  getDescription,
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
                    indicatorDescription={getDescription(scoreType)}
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
  value: any;
  indicator: string;
  scoreType: string;
  indicatorDescription?: string;
}

export const ScoreInfo = ({
  label,
  value,
  indicator,
  scoreType,
  indicatorDescription,
}: ScoreProps) => {
  const searchParams = useSearchParams();
  if (!process.env.NEXT_PUBLIC_TIME_PERIOD) {
    throw new Error('TIME_PERIOD not specified');
  }
  const time_period =
    searchParams.get('time-period') || process.env.NEXT_PUBLIC_TIME_PERIOD;
  const boundary = searchParams.get('boundary') || 'district';
  const region = searchParams.get('region') || '';

  return (
    <div className="flex-1">
      {indicator === 'risk-score' ? (
        <ProgressBar
          size="small"
          customColor={RiskColorMap[parseInt(value)]}
          value={(parseInt(value) / 5) * 100}
        />
      ) : (
        <span>{label}</span>
      )}{' '}
      ++
      {indicator !== 'risk-score' && (
        <strong className="pl-2">{formatNumberToIndianSystem(value)}</strong>
      )}
    </div>
  );
};
