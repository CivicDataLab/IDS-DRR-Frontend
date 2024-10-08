'use client';

import React from 'react';
import * as d3 from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { Spinner, Text } from 'opub-ui';

import { Factors, RiskText } from '@/config/consts';
import MapChart from '@/components/MapChart';
import { MediaRendering } from '@/components/media-rendering';
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
}) => {
  const [map, setMap] = React.useState<any>(null);
  const [mapFeatures, setMapFeatures] = React.useState<any>(mapData.features);

  // console.log('$$$$', mapData.features);
  console.log('$$$$', revenueMapData);

  const params = new URLSearchParams(window.location.search);
  const districtCode = params.get('district-code');

  const values = [];
  for (let i = 0; i < mapFeatures.length; i++) {
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

      const isDuplicate = customLegendData.some(
        (entry) => Math.round(from) === parseInt(entry.label.split(' ')[0])
      );

      if (!isDuplicate) {
        customLegendData.push({
          color: colorScale(from),
          label: `${Math.round(from)}${to ? ` - ${Math.round(to)}` : '+'}`,
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
      <span>${getFactorNameBySlug(indicatorsData, indicator)} : <span style="color: ${colorMap[riskValue]}; text-transform: ${Factors.includes(indicator) && 'uppercase'}; font-weight: bold;">${riskText}</span></span>
      </div>`;
        },
        {
          maxWidth: 200,
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
      try {
        map?.fitBounds(getBoundsData[0]?.properties?.bounds);
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }

    const filterMapData = revenueMapData.features.filter(
      (feature: { properties: { [x: string]: string } }) =>
        feature.properties['district-code'] === districtCode
    );

    setMapFeatures(districtCode ? filterMapData : mapData.features);
  }, [districtCode, map, mapData.features, revenueMapData.features]);

  React.useEffect(() => {
    if (map && map.getContainer() && !districtCode) {
      map?.setView([26.193, 92.773], 7.4);
    }
  }, [map, districtCode]);

  if (mapDataloading || revenueMapDataLoading)
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>Loading...</Text>
      </div>
    );

  return (
    <>
      {/* Mobile View */}
      <MediaRendering minWidth={null} maxWidth="1023">
        <div className="relative h-full w-full pt-[62px]">
          <MapChart
            features={mapFeatures || mapData.features}
            mapZoom={8}
            mapProperty={indicator}
            zoomOnClick={false}
            isCustomColor={!Factors.includes(indicator)}
            customColor={colorScale}
            horizontalLegend={true}
            legendHeading={{
              heading: !Factors.includes(indicator)
                ? `${getFactorNameBySlug(indicatorsData, indicator)} ${getUnitsBySlug(indicatorsData, indicator) && `(${getUnitsBySlug(indicatorsData, indicator)})`}`
                : '',
            }}
            legendData={
              Factors.includes(indicator) ? legendData : customLegendData
            }
            minZoom={3}
            maxZoom={6.3}
            mapDataFn={mapDataFn}
            mouseover={(layer) => {
              const regionName = layer.feature?.properties.name;
              const riskValue = layer.feature?.properties?.[indicator];
              const riskText = Factors.includes(indicator)
                ? RiskText[riskValue]?.indicatorText
                : `${riskValue} ${getUnitsBySlug(indicatorsData, indicator)}`;
              EnablePopup({
                regionName,
                riskValue,
                riskText,
                layer,
              });
            }}
            mouseout={(layer) => {
              layer.closePopup();
              layer.unbindPopup();
            }}
            click={(layer) =>
              onMapClick({
                layerCode: layer.feature?.properties.code,
              })
            }
            fillOpacity={1}
            setMap={setMap}
            resetZoom
            scroolWheelZoom={false}
          />
        </div>
      </MediaRendering>

      {/* Desktop  */}
      <MediaRendering minWidth="1024" maxWidth={null}>
        <div className=" relative h-[90%] w-full">
          <MapChart
            features={mapFeatures || mapData.features}
            mapZoom={7.4}
            mapProperty={indicator}
            zoomOnClick={false}
            isCustomColor={!Factors.includes(indicator)}
            customColor={colorScale}
            legendHeading={{
              heading: !Factors.includes(indicator)
                ? `${getFactorNameBySlug(indicatorsData, indicator)} ${getUnitsBySlug(indicatorsData, indicator) && `(${getUnitsBySlug(indicatorsData, indicator)})`}`
                : '',
            }}
            legendData={
              Factors.includes(indicator) ? legendData : customLegendData
            }
            minZoom={6}
            maxZoom={8}
            mapDataFn={mapDataFn}
            mouseover={(layer) => {
              const regionName = layer.feature?.properties.name;
              const riskValue = layer.feature?.properties?.[indicator];
              const riskText = Factors.includes(indicator)
                ? RiskText[riskValue]?.indicatorText
                : `${riskValue} ${getUnitsBySlug(indicatorsData, indicator)}`;
              EnablePopup({
                regionName,
                riskValue,
                riskText,
                layer,
              });
            }}
            mouseout={(layer) => {
              layer.closePopup();
              layer.unbindPopup();
            }}
            click={(layer) =>
              onMapClick({
                layerCode: layer.feature?.properties.code,
              })
            }
            fillOpacity={1}
            setMap={setMap}
            resetZoom
            scroolWheelZoom={false}
          />
        </div>
      </MediaRendering>
    </>
  );
};
