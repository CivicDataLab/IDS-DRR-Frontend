'use client';

import React from 'react';
import { useFormatNumber } from '@/hooks/use-format-number';
import { useWindowSize } from '@/hooks/use-window-size';
import type { TileLayers } from 'ids-drr-branding-types';
import L from 'leaflet';
import { useTranslations } from 'next-intl';
import { Button, Icon, Spinner, Text } from 'opub-ui';

import {
  type Indicator,
  type State,
} from '@/config/graphql/analaytics-queries';
import { tileLayers } from '@/config/site';
import { getFactorNameBySlug, getUnitsBySlug } from '@/lib/analytics/utils';
import {
  borderFeaturesFromMetadata,
  fetchRasterMetadata,
  fetchRasterValue,
  isInsideRasterBounds,
  leafletBounds,
  resolveTileUrl,
  type RasterMetadata,
} from '@/lib/raster';
import { hasSubDistrictSupport } from '@/lib/state-map-config';
import { type JsonScalar } from '@/lib/types';
import Icons from '@/components/icons';
import MapChart from '@/components/MapChart';
import { useAnalyticsModule } from '@/hooks/use-analytics-module';

const RASTER_PANE = 'idsRasterOverlayPane';

type Props = {
  module: string;
  indicator: string;
  geographyCode: string;
  period: string;
  indicatorsData?: Indicator[];
  currentSelectedState: State;
  borderMapData?: JsonScalar;
  districtCode?: string | null;
  setRegion: (region: string) => void;
  setRevenueRegion: (region: string) => void;
  isOutputPaneOpen?: boolean;
  onToggleOutputPane?: () => void;
};

export function RasterMapComponent({
  module,
  indicator,
  geographyCode,
  period,
  indicatorsData,
  currentSelectedState,
  borderMapData,
  districtCode,
  setRegion,
  setRevenueRegion,
  isOutputPaneOpen,
  onToggleOutputPane,
}: Props) {
  const tCommon = useTranslations('common');
  const tMap = useTranslations('analytics.map');
  const formatNumber = useFormatNumber();
  const { width } = useWindowSize();
  const isMobile = width < 1023;
  const analyticsModule = useAnalyticsModule();
  const withSubDistrictSupport = hasSubDistrictSupport(
    currentSelectedState?.slug,
    analyticsModule
  );

  const tileLayerRef = React.useRef<L.TileLayer | null>(null);
  const [map, setMap] = React.useState<L.Map | null>(null);
  const [metadata, setMetadata] = React.useState<RasterMetadata | null>(null);
  const [metaError, setMetaError] = React.useState<string | null>(null);

  const indicatorName = getFactorNameBySlug(indicatorsData, indicator);
  const indicatorUnit = getUnitsBySlug(indicatorsData, indicator);

  const translatedTileLayers = React.useMemo<TileLayers | undefined>(() => {
    if (!tileLayers) return undefined;
    return Object.fromEntries(
      Object.entries(tileLayers).map(([key, layer]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic next-intl key, guarded by tMap.has
        const translationKey = `layers.${key}` as any;
        return [tMap.has(translationKey) ? tMap(translationKey) : key, layer];
      })
    ) as TileLayers;
  }, [tMap]);

  React.useEffect(() => {
    let cancelled = false;
    fetchRasterMetadata({
      module,
      indicator,
      geography_code: geographyCode,
      period,
    })
      .then((data) => {
        if (!cancelled) {
          setMetaError(null);
          setMetadata(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMetadata(null);
          setMetaError(String((error as Error)?.message ?? error));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [module, indicator, geographyCode, period]);

  const fitBoundsOptions = React.useMemo(
    () =>
      isOutputPaneOpen && !isMobile
        ? { paddingBottomRight: [450, 0] as [number, number] }
        : undefined,
    [isOutputPaneOpen, isMobile]
  );

  // Raster tiles sit below MapChart district borders so clicks still work.
  React.useEffect(() => {
    if (!map || !metadata) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (!map.getPane(RASTER_PANE)) {
      map.createPane(RASTER_PANE);
      const pane = map.getPane(RASTER_PANE);
      if (pane) pane.style.zIndex = '300';
    }

    const base = process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL?.replace(
      /\/$/,
      ''
    );
    const layer = L.tileLayer(
      resolveTileUrl(metadata.tile_url_template, base ?? ''),
      {
        pane: RASTER_PANE,
        opacity: 0.85,
        minZoom: metadata.minzoom,
        maxZoom: metadata.maxzoom,
      }
    );
    layer.addTo(map);
    tileLayerRef.current = layer;
    map.fitBounds(leafletBounds(metadata.bounds), fitBoundsOptions);

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
    };
  }, [map, metadata, fitBoundsOptions]);

  const borderFeatures = React.useMemo(() => {
    const fromMetadata = borderFeaturesFromMetadata(metadata);
    if (fromMetadata?.features?.length) return fromMetadata.features;
    return borderMapData?.features ?? [];
  }, [metadata, borderMapData?.features]);

  // Hover anywhere inside the raster extent (not only on district borders).
  React.useEffect(() => {
    if (!map || !metadata) return;

    const popup = L.popup({
      maxWidth: isMobile ? window.innerWidth * 0.9 : 220,
      closeButton: false,
      className: 'opub-popup',
    });

    let timer: ReturnType<typeof setTimeout> | null = null;

    const onMove = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (!isInsideRasterBounds(lat, lng, metadata.bounds)) {
        if (timer) clearTimeout(timer);
        map.closePopup(popup);
        return;
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        popup
          .setLatLng(e.latlng)
          .setContent(`<div>${tCommon('loading')}</div>`)
          .openOn(map);

        try {
          const result = await fetchRasterValue({
            module,
            indicator,
            geography_code: geographyCode,
            period,
            lat,
            lng,
          });

          let valueText = tMap('rasterOutsideArea');
          if (result.value != null && result.inside_raster) {
            const formatted =
              result.value < 1
                ? result.value.toFixed(3)
                : formatNumber(Math.round(result.value));
            valueText = indicatorUnit
              ? `${formatted} ${indicatorUnit}`
              : formatted;
          } else if (result.value == null) {
            valueText = tMap('noDataAtPoint');
          }

          popup.setContent(
            `<div><span>${indicatorName}: <strong>${valueText}</strong></span></div>`
          );
        } catch {
          popup.setContent(`<div>${tMap('rasterValueError')}</div>`);
        }
      }, 150);
    };

    const onLeave = () => {
      if (timer) clearTimeout(timer);
      map.closePopup(popup);
    };

    map.on('mousemove', onMove);
    map.getContainer().addEventListener('mouseleave', onLeave);

    return () => {
      map.off('mousemove', onMove);
      map.getContainer().removeEventListener('mouseleave', onLeave);
      if (timer) clearTimeout(timer);
      map.closePopup(popup);
    };
  }, [
    map,
    metadata,
    module,
    indicator,
    geographyCode,
    period,
    indicatorName,
    indicatorUnit,
    isMobile,
    tCommon,
    tMap,
    formatNumber,
  ]);

  const onDistrictClick = (layer: {
    feature?: { properties?: { code?: string } };
  }) => {
    const code = layer.feature?.properties?.code;
    if (!code) return;
    map?.closePopup();

    if (!withSubDistrictSupport || !districtCode) {
      setRegion(code);
      return;
    }
    setRevenueRegion(code);
    setRegion(districtCode);
  };

  const mapCenter: [number, number] = metadata
    ? [metadata.center[1], metadata.center[0]]
    : currentSelectedState.center
      ? [currentSelectedState.center[1], currentSelectedState.center[0]]
      : [20.19, 84.44];

  if (metaError) {
    return (
      <div className="flex h-full flex-col place-content-center items-center gap-2 px-6 text-center">
        <Text variant="bodyMd">{tMap('rasterError')}</Text>
        <Text variant="bodySm" className="text-textSubdued">
          {metaError}
        </Text>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>{tCommon('loading')}</Text>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${isMobile ? 'h-full pt-[8dvh] sm:pt-[7dvh] md:pt-[6dvh]' : 'h-[95vh]'} sm:h-[85vh] md:h-[72vh]`}
    >
      {!isOutputPaneOpen && onToggleOutputPane && (
        <div className="absolute right-6 top-20 z-[1000]">
          <Button
            kind="tertiary"
            onClick={onToggleOutputPane}
            className="border flex h-8 w-8 items-center justify-center border-borderSubdued bg-surfaceDefault shadow-basicSm"
          >
            <Icon source={Icons.layoutSidebarRightCollapse} />
          </Button>
        </div>
      )}
      <MapChart
        features={borderFeatures}
        tileLayers={translatedTileLayers}
        mapZoom={metadata.minzoom ?? 6}
        mapCenter={mapCenter}
        mapProperty={indicator}
        zoomOnClick={false}
        resetZoom
        scroolWheelZoom={false}
        fillOpacity={0}
        mapDataFn={() => 'transparent'}
        click={onDistrictClick}
        setMap={setMap}
        height="100%"
      />
    </div>
  );
}
