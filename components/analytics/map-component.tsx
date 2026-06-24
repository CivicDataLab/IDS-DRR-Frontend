'use client';

import React from 'react';
import { useFormatNumber } from '@/hooks/use-format-number';
import { useWindowSize } from '@/hooks/use-window-size';
import * as d3 from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import type { TileLayers } from 'ids-drr-branding-types';
import { useTranslations } from 'next-intl';
import { Button, Icon, Spinner, Text } from 'opub-ui';

import {
  type Indicator,
  type State,
} from '@/config/graphql/analaytics-queries';
import { states, tileLayers } from '@/config/site';
import { isRiskLevel } from '@/lib/analytics';
import { isScoreIndicator } from '@/lib/analytics/factor-role';
import { hasSubDistrictSupport } from '@/lib/state-map-config';
import { type JsonScalar } from '@/lib/types';
import Icons from '@/components/icons';
import MapChart from '@/components/MapChart';
import { getFactorNameBySlug, getUnitsBySlug } from '@/lib/analytics/utils';
import { useAnalyticsModule } from '@/hooks/use-analytics-module';

export const MapComponent = ({
  indicator,
  mapDataloading,
  indicatorsData,
  revenueMapDataLoading,
  mapData,
  revenueMapData,
  setRegion,
  setRevenueRegion,
  currentSelectedState,
  isOutputPaneOpen,
  onToggleOutputPane,
}: {
  indicator: string;
  mapDataloading: boolean;
  indicatorsData: Indicator[] | undefined;
  revenueMapDataLoading: boolean;
  mapData: JsonScalar;
  revenueMapData: JsonScalar;
  setRegion: (region: string) => void;
  setRevenueRegion: (region: string) => void;
  currentSelectedState: State;
  isOutputPaneOpen?: boolean;
  onToggleOutputPane?: () => void;
}) => {
  const tRisk = useTranslations('analytics.risk');
  const tCommon = useTranslations('common');
  const tMap = useTranslations('analytics.map');
  const formatNumber = useFormatNumber();
  const analyticsModule = useAnalyticsModule();
  const withSubDistrictSupport = hasSubDistrictSupport(
    currentSelectedState?.slug,
    analyticsModule
  );

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Leaflet map instance
  const [map, setMap] = React.useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Leaflet overlay layer
  const [overlayFeatures, setOverlayFeatures] = React.useState<any>(null);

  React.useEffect(() => {
    const slug = currentSelectedState?.slug;
    const overlay = states.find((state) => state.slug === slug)?.overlay;
    if (!overlay) {
      setOverlayFeatures(null);
      return;
    }
    let cancelled = false;
    overlay()
      .then((mod) => {
        if (!cancelled) setOverlayFeatures(mod.default);
      })
      .catch(() => {
        if (!cancelled) setOverlayFeatures(null);
      });
    return () => {
      cancelled = true;
    };
  }, [currentSelectedState?.slug]);

  const params = new URLSearchParams(window.location.search);
  const districtCode = params.get('district-code');

  const mapFeatures = React.useMemo(() => {
    if (!withSubDistrictSupport || !districtCode) return mapData?.features;
    return (revenueMapData?.features || []).filter(
      (feature: { properties: { [x: string]: string } }) =>
        feature.properties['district-code'] === districtCode
    );
  }, [
    districtCode,
    mapData?.features,
    revenueMapData?.features,
    withSubDistrictSupport,
  ]);

  const { width } = useWindowSize();
  const isMobile = width < 1023;

  const values = [];
  for (let i = 0; i < mapFeatures?.length; i++) {
    if (mapFeatures[i].properties[indicator] == null) continue;
    values.push(mapFeatures[i].properties[indicator]);
  }

  const customLegendData: { label: string; color: string }[] = [];
  const hasData = values.length > 0;
  const allZeros = hasData && values.every((val) => val === 0);

  // Neutral fill used when the indicator returns no data for the current
  // selection (e.g. a slug that doesn't correspond to a data column).
  const NO_DATA_FILL = '#e5e5e5';

  // Set the sequential scale properties
  const colorScale: (n: number) => string = hasData
    ? d3
        .scaleSequential()
        .domain([Math.min(...values), Math.max(...values)])
        .interpolator(interpolateBlues)
    : () => NO_DATA_FILL;

  if (hasData && !isScoreIndicator(indicator) && !allZeros) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const step = (max - min) / 3;
    const grades = Array.from({ length: 3 + 1 }, (_, i) => min + step * i);

    for (let i = 0; i < grades.length; i++) {
      const from = grades[i];
      const to = grades[i + 1];

      const formatValue = (num: number) => {
        if (num < 1) {
          return num < 0.001 ? '0' : num.toFixed(3);
        }
        // return num > 1
        //   ? Math.round(num).toString()
        //   : formatNumber(Math.round(num));
        return formatNumber(Math.round(num));
      };

      const isDuplicate = customLegendData.some(
        (entry) => formatValue(from) === entry.label.split(' ')[0]
      );

      if (!isDuplicate) {
        customLegendData.push({
          color: colorScale(from),
          label: `${formatValue(from)}${to ? ` - ${formatValue(to)}` : '+'}`,
        });
      }
    }
  }

  if (allZeros) {
    customLegendData.unshift({
      color: colorScale(0),
      label: '0',
    });
  }

  if (!hasData && !isScoreIndicator(indicator)) {
    customLegendData.push({
      color: NO_DATA_FILL,
      label: tMap('noData'),
    });
  }

  const mapDataFn = (value: number) => {
    let colorString;
    switch (value) {
      case 1:
        colorString = '#4575b4';
        break;
      case 2:
        colorString = '#65A4BD';
        break;
      case 3:
        colorString = '#FFED6E';
        break;
      case 4:
        colorString = '#FB8C35';
        break;
      case 5:
        colorString = '#D41505';
        break;
      default:
        colorString = '#4575b4';
        break;
    }
    return colorString;
  };

  const legendData = [
    { label: tRisk('5'), color: '#D41505' },
    { label: tRisk('4'), color: '#FB8C35' },
    { label: tRisk('3'), color: '#FFED6E' },
    { label: tRisk('2'), color: '#65A4BD' },
    { label: tRisk('1'), color: '#4575b4' },
  ];

  const colorMap: { [key: number]: string } = {
    1: 'var(--mapRiskVeryLow)',
    2: 'var(--mapRiskLow)',
    3: 'var(--mapRiskMedium)',
    4: 'var(--mapRiskHigh)',
    5: 'var(--mapRiskVeryHigh)',
  };

  const onMapClick = ({ layerCode }: { layerCode: string }) => {
    if (!withSubDistrictSupport) {
      setRegion(layerCode);
      return;
    }

    if (!districtCode) {
      setRegion(layerCode);
      return;
    }

    setRevenueRegion(layerCode);
    setRegion(districtCode);
  };

  function EnablePopup({
    regionName,
    riskValue,
    riskText,
    layer,
  }: {
    regionName: string;
    riskValue: number;
    riskText: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Leaflet layer
    layer: any;
  }) {
    layer
      .bindPopup(
        () => {
          return `
      <div>
      <strong>${regionName.toUpperCase()}</strong><br/>
      <span>${getFactorNameBySlug(indicatorsData, indicator)} : <span style="color: ${colorMap[riskValue]}; text-transform: ${isScoreIndicator(indicator) && 'uppercase'}; font-weight: bold;">${
        isScoreIndicator(indicator)
          ? riskText
          : riskValue == null
            ? tCommon('na')
            : `${formatNumber(riskValue)} ${getUnitsBySlug(
                indicatorsData,
                indicator
              )}`
      }</span></span>
      </div>`;
        },
        {
          maxWidth: isMobile ? '90%' : 200,
          closeButton: false,
          autoClose: false,
          closeOnEscapeKey: false,
          closeOnClick: false,
          id: `${regionName}`,
          className: 'opub-popup',
        }
      )
      .openPopup();
  }

  const safeApply = React.useCallback(
    (apply: () => void) => {
      requestAnimationFrame(() => {
        map.invalidateSize();
        const size = map.getSize();
        if (!size.x || !size.y) return;
        apply();
      });
    },
    [map]
  );

  const OUTPUT_PANE_WIDTH = 450;
  const fitBoundsOptions = React.useMemo(
    () =>
      isOutputPaneOpen && !isMobile
        ? { paddingBottomRight: [OUTPUT_PANE_WIDTH, 0] as [number, number] }
        : undefined,
    [isOutputPaneOpen, isMobile]
  );

  // Fit to the selected district.
  const fittedDistrictRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    // Reset if user returns to state-level.
    if (!withSubDistrictSupport || !districtCode) {
      fittedDistrictRef.current = null;
      return;
    }
    if (!map || !map.getContainer()) return;
    const key = `${districtCode}|${isOutputPaneOpen}|${isMobile}`;
    // Don't re-fit unnecessarily.
    if (fittedDistrictRef.current === key) return;
    fittedDistrictRef.current = key;
    const feature = mapData?.features?.find(
      (f: { properties: { [x: string]: string } }) =>
        f.properties['code'] === districtCode
    );
    if (!feature?.properties?.bounds) return;
    map.whenReady(() =>
      safeApply(() =>
        map.fitBounds(feature.properties.bounds, fitBoundsOptions)
      )
    );
  }, [
    districtCode,
    withSubDistrictSupport,
    map,
    mapData?.features,
    isOutputPaneOpen,
    isMobile,
    fitBoundsOptions,
    safeApply,
  ]);

  // Defer popup close so a quick edge re-entry (cursor wobbling across a
  // polygon's jagged boundary) doesn't tear down and rebuild the popup.
  const popupCloseTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Leaflet layer ref
  const poppedLayerRef = React.useRef<any>(null);
  React.useEffect(
    () => () => {
      if (popupCloseTimerRef.current) clearTimeout(popupCloseTimerRef.current);
    },
    []
  );

  React.useEffect(() => {
    if (!map || !map.getContainer()) return;
    if (withSubDistrictSupport && districtCode) return;

    map.whenReady(() =>
      safeApply(() => {
        if (currentSelectedState?.bounds) {
          map.fitBounds(currentSelectedState.bounds, fitBoundsOptions);
        } else if (currentSelectedState?.center) {
          const state = states.find(
            (s) => s.slug === currentSelectedState.slug
          );
          map.setView(currentSelectedState.center, state?.zoom ?? 6);
        }
      })
    );
  }, [
    map,
    districtCode,
    withSubDistrictSupport,
    currentSelectedState,
    isOutputPaneOpen,
    isMobile,
    fitBoundsOptions,
    safeApply,
  ]);

  if (mapDataloading || (withSubDistrictSupport && revenueMapDataLoading))
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>{tCommon('loading')}</Text>
      </div>
    );

  const addlFeaturesStyleArray = [
    {
      // Style for addl layer customized to rivers
      weight: 1.5,
      opacity: 1,
      color: '#7bd4ef',
      fillOpacity: 1,
    },
  ];

  const stateConfig = states.find((s) => s.slug === currentSelectedState?.slug);
  const mapCenter =
    currentSelectedState?.center?.length === 2
      ? (currentSelectedState.center as [number, number])
      : undefined;

  return (
    <>
      {' '}
      {/* "react-leaflet": "^4.2.1", */}
      {/* <div
        className={`relative w-full ${isMobile ? 'h-full' : 'h-[98%]'} ${isMobile ? 'pt-[68px]' : ''}`}
      > */}
      <div
        role="application"
        aria-label={tMap('ariaLabel')}
        className={`relative w-full ${isMobile ? 'h-full pt-[8dvh] sm:pt-[7dvh] md:pt-[6dvh]' : 'h-[95vh]'} sm:h-[85vh] md:h-[72vh]`}
      >
        {/* Toggle button just below map layers – always available on desktop when pane is closed */}
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
          features={mapFeatures || mapData?.features}
          tileLayers={translatedTileLayers}
          addlFeaturesArray={overlayFeatures ? [overlayFeatures] : []}
          addlFeaturesStyleArray={addlFeaturesStyleArray}
          mapCenter={mapCenter}
          mapZoom={stateConfig?.zoom ?? 6}
          mapProperty={indicator}
          zoomOnClick={false}
          isCustomColor={!isScoreIndicator(indicator)}
          customColor={colorScale}
          horizontalLegend={isMobile ? true : false}
          legendHeading={{
            heading: !isScoreIndicator(indicator)
              ? `${getFactorNameBySlug(indicatorsData, indicator)} ${
                  getUnitsBySlug(indicatorsData, indicator) &&
                  `${
                    getUnitsBySlug(indicatorsData, indicator).includes('(')
                      ? ` ${getUnitsBySlug(indicatorsData, indicator)}`
                      : ` (${getUnitsBySlug(indicatorsData, indicator)})`
                  }`
                }`
              : '',
          }}
          legendData={
            isScoreIndicator(indicator) ? legendData : customLegendData
          }
          {...(() => {
            // Pair minZoom/maxZoom: setting one without the other makes Leaflet
            // throw "Attempted to load an infinite number of tiles."
            if (
              stateConfig?.minZoom === undefined &&
              stateConfig?.maxZoom === undefined
            ) {
              return {};
            }
            return {
              minZoom: stateConfig?.minZoom ?? 0,
              maxZoom: stateConfig?.maxZoom ?? 18,
            };
          })()}
          mapDataFn={mapDataFn}
          mouseover={(layer) => {
            // If a close was pending, cancel it. When it was scheduled for a
            // different layer (cursor moved A -> B faster than the timer),
            // close that one now so we don't briefly show two popups.
            if (popupCloseTimerRef.current) {
              clearTimeout(popupCloseTimerRef.current);
              popupCloseTimerRef.current = null;
              if (poppedLayerRef.current && poppedLayerRef.current !== layer) {
                poppedLayerRef.current.closePopup();
                poppedLayerRef.current.unbindPopup();
                poppedLayerRef.current = null;
              }
            }
            // Same-layer wobble: the popup is still bound and open, no rebuild.
            if (poppedLayerRef.current === layer) return;

            const regionName = layer.feature?.properties.name;
            const riskValue = layer.feature?.properties?.[indicator];
            const riskKey = String(riskValue);
            const riskText = isScoreIndicator(indicator)
              ? isRiskLevel(riskKey)
                ? tRisk(riskKey)
                : tCommon('na')
              : riskValue == null
                ? tCommon('na')
                : `${formatNumber(riskValue)} ${getUnitsBySlug(
                    indicatorsData,
                    indicator
                  )}`;
            // const riskText = isScoreIndicator(indicator)
            //   ? RiskText[riskValue]?.indicatorText
            //   : `${riskValue} ${getUnitsBySlug(indicatorsData, indicator)}`;
            poppedLayerRef.current = layer;
            EnablePopup({ regionName, riskValue, riskText, layer });
          }}
          mouseout={(layer) => {
            // Defer the close so quick re-entry along a jagged polygon edge
            // (or an instant transition to an adjacent feature) doesn't tear
            // down a popup that's about to be reopened.
            popupCloseTimerRef.current = setTimeout(() => {
              layer.closePopup();
              layer.unbindPopup();
              if (poppedLayerRef.current === layer)
                poppedLayerRef.current = null;
              popupCloseTimerRef.current = null;
            }, 100);
          }}
          click={(layer) =>
            onMapClick({ layerCode: layer.feature?.properties.code })
          }
          fillOpacity={1}
          setMap={setMap}
          resetZoom
          scroolWheelZoom={false}
          // height="75vh"
        />{' '}
      </div>{' '}
    </>
  );
};
