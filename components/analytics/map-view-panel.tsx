'use client';

import React from 'react';
import { parseAsString, useQueryState } from 'next-usequerystate';

import {
  type Indicator,
  type IndicatorCategory,
  type State,
} from '@/config/graphql/analaytics-queries';
import { isRasterAvailableForIndicator } from '@/lib/analytics/indicator-tree';
import { resolveRasterGeographyCode } from '@/lib/raster';
import { type JsonScalar } from '@/lib/types';
import { MapComponent } from './map-component';
import { MapLayerToggle, type MapLayerMode } from './map-layer-toggle';
import { RasterMapComponent } from './raster-map-component';

type Props = {
  indicator: string;
  indicatorCategories?: IndicatorCategory[];
  analyticsModule: string;
  timePeriod: string;
  districtCode?: string | null;
  revenueCode?: string | null;
  mapDataloading: boolean;
  revenueMapDataLoading: boolean;
  indicatorsData: Indicator[] | undefined;
  mapData: JsonScalar;
  revenueMapData: JsonScalar;
  setRegion: (region: string) => void;
  setRevenueRegion: (region: string) => void;
  currentSelectedState: State;
  isOutputPaneOpen?: boolean;
  onToggleOutputPane?: () => void;
};

export function MapViewPanel({
  indicator,
  indicatorCategories,
  analyticsModule,
  timePeriod,
  districtCode,
  revenueCode,
  mapDataloading,
  revenueMapDataLoading,
  indicatorsData,
  mapData,
  revenueMapData,
  setRegion,
  setRevenueRegion,
  currentSelectedState,
  isOutputPaneOpen,
  onToggleOutputPane,
}: Props) {
  const rasterAvailable = isRasterAvailableForIndicator(
    indicatorCategories,
    indicator
  );
  const [mapLayer, setMapLayer] = useQueryState(
    'map-layer',
    parseAsString.withDefault('vector')
  );

  React.useEffect(() => {
    if (!rasterAvailable && mapLayer === 'raster') {
      setMapLayer('vector', { shallow: true });
    }
  }, [rasterAvailable, mapLayer, setMapLayer]);

  const activeLayer = (
    rasterAvailable && mapLayer === 'raster' ? 'raster' : 'vector'
  ) as MapLayerMode;

  const geographyCode = resolveRasterGeographyCode({
    stateCode: currentSelectedState.code,
    districtCode,
    revenueCode,
  });

  return (
    <div className="relative h-full w-full">
      {rasterAvailable && (
        <MapLayerToggle
          value={activeLayer}
          onChange={(mode) => setMapLayer(mode, { shallow: false })}
        />
      )}

      {activeLayer === 'raster' && geographyCode ? (
        <RasterMapComponent
          module={analyticsModule}
          indicator={indicator}
          geographyCode={geographyCode}
          period={timePeriod}
          indicatorsData={indicatorsData}
          currentSelectedState={currentSelectedState}
          borderMapData={mapData}
          districtCode={districtCode}
          setRegion={setRegion}
          setRevenueRegion={setRevenueRegion}
          isOutputPaneOpen={isOutputPaneOpen}
          onToggleOutputPane={onToggleOutputPane}
        />
      ) : (
        <MapComponent
          indicator={indicator}
          mapDataloading={mapDataloading}
          revenueMapDataLoading={revenueMapDataLoading}
          indicatorsData={indicatorsData}
          setRegion={setRegion}
          setRevenueRegion={setRevenueRegion}
          revenueMapData={revenueMapData}
          mapData={mapData}
          currentSelectedState={currentSelectedState}
          isOutputPaneOpen={isOutputPaneOpen}
          onToggleOutputPane={onToggleOutputPane}
        />
      )}
    </div>
  );
}
