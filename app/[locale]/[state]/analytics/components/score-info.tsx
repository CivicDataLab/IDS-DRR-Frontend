import React from 'react';
import { ProgressBar } from 'opub-ui';

import { RiskColorMap } from '@/config/consts';
import { useFormatNumber } from '@/hooks/use-format-number';

interface ScoreProps {
  label: string;
  value: any;
  indicator: string;
}

export function ScoreInfo({ label, value, indicator }: ScoreProps) {
  const formatNumber = useFormatNumber();
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
      {indicator !== 'risk-score' && (
        <strong className="pl-2">{formatNumber(value)}</strong>
      )}
    </div>
  );
}
