import React from 'react';
import { useFormatNumber } from '@/hooks/use-format-number';
import { ProgressBar } from 'opub-ui';

import { isRiskLevel, RiskColorMap } from '@/lib/analytics';
import { isRootRiskIndicator } from '@/lib/analytics/root-indicator';

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
    <div className="ml-1 flex-1">
      {isRootRiskIndicator(indicator) ? (
        <ProgressBar
          size="small"
          customColor={isRiskLevel(level) ? RiskColorMap[level] : undefined}
          value={(parseInt(value, 10) / 5) * 100}
        />
      ) : (
        <span>{label}</span>
      )}{' '}
      {!isRootRiskIndicator(indicator) && (
        <strong className="pl-2">{formatNumber(value)}</strong>
      )}
    </div>
  );
}
