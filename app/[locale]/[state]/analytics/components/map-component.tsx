'use client';

import React from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import * as d3 from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import type { TileLayers } from 'ids-drr-branding-types';
import { useTranslations } from 'next-intl';
import { Button, Icon, Spinner, Text } from 'opub-ui';

import { states, tileLayers } from '@/config/site';
import { useFormatNumber } from '@/hooks/use-format-number';
import { Factors, isRiskLevel } from '@/lib/analytics';
import Icons from '@/components/icons';
import MapChart from '@/components/MapChart';
import { getFactorNameBySlug, getUnitsBySlug } from '../utils/utils';

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
  indicatorsData: {
    name: string;
    slug: string;
    unit: string;
    long_description?: string;
    short_description: string;
  }[];
  revenueMapDataLoading: boolean;
  mapData: any;
  revenueMapData: any;
  setRegion: any;
  setRevenueRegion: any;
  currentSelectedState: any;
  isOutputPaneOpen?: boolean;
  onToggleOutputPane?: () => void;
}) => {
  const tRisk = useTranslations('analytics.risk');
  const tCommon = useTranslations('common');
  const tMap = useTranslations('analytics.map');
  const formatNumber = useFormatNumber();

  const translatedTileLayers = React.useMemo<TileLayers | undefined>(() => {
    if (!tileLayers) return undefined;
    return Object.fromEntries(
      Object.entries(tileLayers).map(([key, layer]) => {
        const translationKey = `layers.${key}` as any;
        return [
          tMap.has(translationKey) ? tMap(translationKey) : key,
          layer,
        ];
      })
    ) as TileLayers;
  }, [tMap]);
  const [map, setMap] = React.useState<any>(null);
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
  const revenueCode = params.get('revenue-code');

  const mapFeatures = React.useMemo(() => {
    if (!districtCode) return mapData?.features;
    return (revenueMapData?.features || []).filter(
      (feature: { properties: { [x: string]: string } }) =>
        feature.properties['district-code'] === districtCode
    );
  }, [districtCode, mapData?.features, revenueMapData?.features]);

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

  if (hasData && !Factors.includes(indicator) && !allZeros) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const step = (max - min) / 3;
    const grades = Array.from({ length: 3 + 1 }, (_, i) => min + step * i);

    for (let i = 0; i < grades.length; i++) {
      const from = grades[i];
      const to = grades[i + 1];

      const formatValue = (num: any) => {
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

  if (!hasData && !Factors.includes(indicator)) {
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
    if (!districtCode) {
      setRegion(layerCode);
    }

    if (districtCode) {
      setRevenueRegion(layerCode);
      setRegion(districtCode);
    }
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
    layer: any;
  }) {
    layer
      .bindPopup(
        () => {
          return `
      <div>
      <strong>${regionName.toUpperCase()}</strong><br/>
      <span>${getFactorNameBySlug(indicatorsData, indicator)} : <span style="color: ${colorMap[riskValue]}; text-transform: ${Factors.includes(indicator) && 'uppercase'}; font-weight: bold;">${
        Factors.includes(indicator)
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

  // This and fittedRevenueRef prevent fitBounds when switching indicators.
  const fittedDistrictRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!districtCode || !map || !map.getContainer()) return;
    // Set the key such that clicking the back icon from the subdistrict refits to the district.
    const key = `${districtCode}|${revenueCode ?? ''}|${isOutputPaneOpen}|${isMobile}`;
    if (fittedDistrictRef.current === key) return;
    fittedDistrictRef.current = key;
    // Don't fit to the district if a subdistrict is set.
    if (revenueCode) return;
    const feature = mapData.features.find(
      (f: { properties: { [x: string]: string } }) =>
        f.properties['code'] === districtCode
    );
    if (!feature?.properties?.bounds) return;
    map.whenReady(() =>
      safeApply(() => map.fitBounds(feature.properties.bounds, fitBoundsOptions))
    );
  }, [districtCode, revenueCode, map, mapData?.features, isOutputPaneOpen, isMobile, fitBoundsOptions, safeApply]);

  // Similar to fittedDistrictRef.
  const fittedRevenueRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!revenueCode || !map || !map.getContainer()) return;
    const key = `${revenueCode}|${isOutputPaneOpen}|${isMobile}`;
    if (fittedRevenueRef.current === key) return;
    const feature = revenueMapData?.features.find(
      (f: { properties: { [x: string]: string } }) =>
        f.properties['code'] === revenueCode
    );
    if (!feature?.properties?.bounds) return;
    fittedRevenueRef.current = key;
    map.whenReady(() =>
      safeApply(() => map.fitBounds(feature.properties.bounds, fitBoundsOptions))
    );
  }, [revenueCode, map, revenueMapData?.features, isOutputPaneOpen, isMobile, fitBoundsOptions, safeApply]);

  React.useEffect(() => {
    if (!map || !map.getContainer()) return;
    if (districtCode) return;

    map.whenReady(() =>
      safeApply(() => {
        if (currentSelectedState?.bounds) {
          map.fitBounds(currentSelectedState.bounds, fitBoundsOptions);
        } else if (currentSelectedState?.center) {
          const state = states.find((s) => s.slug === currentSelectedState.slug);
          map.setView(currentSelectedState.center, state?.zoom ?? 6);
        }
      })
    );
  }, [map, districtCode, currentSelectedState, isOutputPaneOpen, isMobile, fitBoundsOptions, safeApply]);

  if (mapDataloading || revenueMapDataLoading)
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

  return (
    <>
      {' '}
      {/* "react-leaflet": "^4.2.1", */}
      {/* <div
        className={`relative w-full ${isMobile ? 'h-full' : 'h-[98%]'} ${isMobile ? 'pt-[68px]' : ''}`}
      > */}
      <div
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
          features={mapFeatures || mapData.features}
          tileLayers={translatedTileLayers}
          addlFeaturesArray={overlayFeatures ? [overlayFeatures] : []}
          addlFeaturesStyleArray={addlFeaturesStyleArray}
          mapZoom={isMobile ? 8 : 7.4}
          mapProperty={indicator}
          zoomOnClick={false}
          isCustomColor={!Factors.includes(indicator)}
          customColor={colorScale}
          horizontalLegend={isMobile ? true : false}
          legendHeading={{
            heading: !Factors.includes(indicator)
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
            Factors.includes(indicator) ? legendData : customLegendData
          }
          minZoom={isMobile ? 3 : 6}
          maxZoom={isMobile ? 6.3 : 8}
          mapDataFn={mapDataFn}
          mouseover={(layer) => {
            const regionName = layer.feature?.properties.name;
            const riskValue = layer.feature?.properties?.[indicator];
            const riskKey = String(riskValue);
            const riskText = Factors.includes(indicator)
              ? isRiskLevel(riskKey)
                ? tRisk(riskKey)
                : tCommon('na')
              : riskValue == null
                ? tCommon('na')
                : `${formatNumber(riskValue)} ${getUnitsBySlug(
                    indicatorsData,
                    indicator
                  )}`;
            // const riskText = Factors.includes(indicator)
            //   ? RiskText[riskValue]?.indicatorText
            //   : `${riskValue} ${getUnitsBySlug(indicatorsData, indicator)}`;
            EnablePopup({ regionName, riskValue, riskText, layer });
          }}
          mouseout={(layer) => {
            layer.closePopup();
            layer.unbindPopup();
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
