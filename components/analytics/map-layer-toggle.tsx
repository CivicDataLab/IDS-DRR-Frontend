'use client';

import { useTranslations } from 'next-intl';
import { Button } from 'opub-ui';

import { cn } from '@/lib/utils';

export type MapLayerMode = 'vector' | 'raster';

type Props = {
  value: MapLayerMode;
  onChange: (mode: MapLayerMode) => void;
  className?: string;
};

export function MapLayerToggle({ value, onChange, className }: Props) {
  const tMap = useTranslations('analytics.map');

  return (
    <div
      className={cn(
        'rounded-md border absolute left-12 top-4 z-[1000] flex flex gap-2 overflow-hidden border-borderSubdued shadow-basicSm',
        className
      )}
    >
      <Button
        kind={value === 'vector' ? 'primary' : 'secondary'}
        onClick={() => onChange('vector')}
        className={cn(
          'rounded-none px-2',
          value === 'vector'
            ? 'bg-backgroundSolidDark text-textOnBGDefault hover:bg-backgroundSolidDark hover:text-borderDisabled'
            : 'bg-white text-textDefault hover:bg-backgroundSolidDark hover:text-borderDisabled'
        )}
      >
        {tMap('aggregated')}
      </Button>
      <Button
        kind={value === 'raster' ? 'primary' : 'secondary'}
        onClick={() => onChange('raster')}
        className={cn(
          'rounded-none px-2',
          value === 'raster'
            ? 'bg-backgroundSolidDark text-textOnBGDefault hover:bg-backgroundSolidDark hover:text-borderDisabled'
            : 'bg-white text-textDefault hover:bg-backgroundSolidDark hover:text-borderDisabled'
        )}
      >
        {tMap('localized')}
      </Button>
    </div>
  );
}
