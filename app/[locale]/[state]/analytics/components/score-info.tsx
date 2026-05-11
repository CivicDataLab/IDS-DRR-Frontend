import React from 'react';
import { ProgressBar } from 'opub-ui';

import { useFormatNumber } from '@/hooks/use-format-number';
import { isRiskLevel, RiskColorMap } from '@/lib/analytics';

interface ScoreProps {
  label: string;
  value: string;
  indicator: string;
}

export function ScoreInfo({ label, value, indicator }: ScoreProps) {
  const formatNumber = useFormatNumber();
  // Backend serializes values like "5.0 score" (numeric + unit), so use
  // parseInt (lenient on the trailing unit) rather than Number (strict).
  const level = String(parseInt(value, 10));
  return (
    <div className="flex-1">
      {indicator === 'risk-score' ? (
        <ProgressBar
          size="small"
          customColor={isRiskLevel(level) ? RiskColorMap[level] : undefined}
          value={(parseInt(value, 10) / 5) * 100}
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
