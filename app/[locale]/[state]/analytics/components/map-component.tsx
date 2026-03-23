'use client';

import React from 'react';
import { hp_rivers_features } from '@/geo_json/hp_rivers_geojson';
import { useWindowSize } from '@/hooks/use-window-size';
import * as d3 from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { Button, Icon, Spinner, Text } from 'opub-ui';

import { Factors, RiskText } from '@/config/consts';
import Icons from '@/components/icons';
import MapChart from '@/components/MapChart';
import {
  formatNumberToIndianSystem,
  getFactorNameBySlug,
  getUnitsBySlug,
} from '../utils/utils';

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
  const [map, setMap] = React.useState<any>(null);
  const [mapFeatures, setMapFeatures] = React.useState<any>(mapData.features);

  const params = new URLSearchParams(window.location.search);
  const districtCode = params.get('district-code');

  const { width } = useWindowSize();
  const isMobile = width < 1023;

  const values = [];
  for (let i = 0; i < mapFeatures?.length; i++) {
    if (mapFeatures[i].properties[indicator] == null) continue;
    values.push(mapFeatures[i].properties[indicator]);
  }

  const customLegendData: { label: string; color: string }[] = [];
  const allZeros = values.every((val) => val === 0);

  // Set the sequential scale properties
  const colorScale = d3
    .scaleSequential()
    .domain([Math.min(...values), Math.max(...values)])
    .interpolator(interpolateBlues);

  if (!Factors.includes(indicator) && !allZeros) {
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
        //   : formatNumberToIndianSystem(Math.round(num));
        return formatNumberToIndianSystem(Math.round(num));
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
    {
      label: 'Very High Risk',
      color: '#D41505',
    },
    {
      label: 'High Risk',
      color: '#FB8C35',
    },
    {
      label: 'Medium Risk',
      color: '#FFED6E',
    },
    {
      label: 'Low Risk',
      color: '#65A4BD',
    },
    {
      label: 'Very Low Risk',
      color: '#4575b4',
    },
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
          : `${formatNumberToIndianSystem(riskValue)} ${getUnitsBySlug(
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

  React.useEffect(() => {
    const getBoundsData = mapData.features.filter(
      (feature: { properties: { [x: string]: string } }) =>
        feature.properties['code'] === districtCode
    );

    if (
      getBoundsData.length > 0 &&
      getBoundsData[0]?.properties?.bounds &&
      map &&
      map.getContainer()
    ) {
      map.whenReady(() => {
        try {
          map.fitBounds(getBoundsData[0]?.properties?.bounds);
        } catch (error) {
          console.warn('Error fitting bounds:', error);
        }
      });
    }

    const filterMapData = revenueMapData?.features.filter(
      (feature: { properties: { [x: string]: string } }) =>
        feature.properties['district-code'] === districtCode
    );

    setMapFeatures(districtCode ? filterMapData : mapData?.features);
  }, [districtCode, map, mapData?.features, revenueMapData?.features]);

  React.useEffect(() => {
    try {
      setTimeout(() => {
        if (
          map &&
          map?.getContainer() &&
          currentSelectedState.center &&
          !districtCode &&
          currentSelectedState.code !== '18'
        ) {
          map?.setView(currentSelectedState.center, 7.4);
        }
      }, 100);
    } catch (error) {
      console.log(error);
    }
  }, [map, districtCode, currentSelectedState]);

  if (mapDataloading || revenueMapDataLoading)
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>Loading...</Text>
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
          addlFeaturesArray={
            // Replace this logic soon with attribute returned from getStates call
            currentSelectedState.code === '02' ? [hp_rivers_features] : []
          }
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
            const riskText = Factors.includes(indicator)
              ? RiskText[riskValue]?.indicatorText
              : `${formatNumberToIndianSystem(riskValue)} ${getUnitsBySlug(
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
