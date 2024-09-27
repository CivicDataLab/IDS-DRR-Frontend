'use client';

import React from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import * as d3 from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { Spinner, Text } from 'opub-ui';

import { Factors, RiskText } from '@/config/consts';
import { deSlugify } from '@/lib/utils';
import MapChart from '@/components/MapChart';
import { MediaRendering } from '@/components/media-rendering';
import { FactorList } from './factor-list';

export const MapComponent = ({
  indicator,
  regions,
  mapDataloading,
  revenueMapDataLoading,
  mapData,
  revenueMapData,
  setRegion,
  setRevenueRegion,
}: {
  indicator: string;
  regions: { label: string; value: string }[];
  mapDataloading: boolean;
  revenueMapDataLoading: boolean;
  mapData: any;
  revenueMapData: any;
  setRegion: any;
  setRevenueRegion: any;
}) => {
  const [map, setMap] = React.useState<any>(null);
  const [mapFeatures, setMapFeatures] = React.useState<any>(mapData.features);
  const params = new URLSearchParams(window.location.search);
  const districtCode = params.get('district-code');

  console.log('coming to map');

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

  const onMapClick = ({
    layer,
    layerCode,
  }: {
    layer: any;
    layerCode: string;
    revenueMapData: any;
  }) => {
    if (!districtCode) {
      setRegion(layerCode);
    }

    if (districtCode) {
      setRevenueRegion(layerCode);
      setRegion(districtCode);
    }
  };

  React.useEffect(() => {
    if (map && map.getContainer()) {
      const getBoundsData = mapData.features.filter(
        (feature: { properties: { [x: string]: string } }) =>
          feature.properties['code'] === districtCode
      );
      getBoundsData.length > 0 &&
        map.fitBounds(getBoundsData[0].properties.bounds);
      const filterMapData = revenueMapData.features.filter(
        (feature: { properties: { [x: string]: string } }) =>
          feature.properties['district-code'] === districtCode
      );
      setMapFeatures(filterMapData);
      if (!districtCode) {
        setMapFeatures(mapData.features);
      }
    }
  }, [districtCode, map, mapData]);

  React.useEffect(() => {
    if (map && map.getContainer() && !districtCode) {
      map?.setView([26.193, 92.773], 7.4);
    }
  }, [map, districtCode]);

  React.useEffect(() => {
    const regionsArray: string[] = [];
    regions?.forEach((region) => {
      regionsArray.push(region.value);
    });

    if (map) {
      const openPopups: any[] = [];
      map.eachLayer((layer: any) => {
        const regionName = layer.feature?.properties.name;
        const regionCode = layer.feature?.properties.code;
        const riskValue = layer.feature?.properties?.[indicator];

        const riskText = Factors.includes(indicator)
          ? RiskText[riskValue]?.indicatorText
          : riskValue;

        if (regionsArray.includes(regionCode)) {
          const popup = layer.getPopup();
          if (popup) {
            openPopups.push(popup);
          } else {
            layer
              .bindPopup(
                () => {
                  return `
                  <div>
                  <strong>${regionName.toUpperCase()}</strong><br/>
                  <span>${deSlugify(indicator)}:<span style="color: ${colorMap[riskValue]}; text-transform: uppercase;">${riskText}</span></span>
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
        } else {
          layer.closePopup();
          layer.unbindPopup();
          // Remove the layer from the map
          if (layer.getPopup()) {
            map.removeLayer(layer);
          }
        }
      });

      // Close the last open popup if regionsArray is empty
      if (regionsArray.length === 0 && openPopups.length > 0) {
        const lastLayer = openPopups[openPopups.length - 1];
        map.removeLayer(lastLayer);
      }
    }
  }, [indicator, map, regions]);

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
            mapZoom={6}
            minZoom={5}
            maxZoom={8}
            mapProperty={indicator}
            zoomOnClick={false}
            legendData={legendData}
            mapDataFn={mapDataFn}
            click={(layer) =>
              onMapClick({
                layer: layer,
                layerCode: layer.feature?.properties.code,
                revenueMapData: revenueMapData,
              })
            }
            fillOpacity={1}
            setMap={setMap}
            resetZoom
            scroolWheelZoom={false}
          />
        </div>
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <div className=" relative h-[90%] w-full">
          <MapChart
            features={mapFeatures || mapData.features}
            mapZoom={7.4}
            mapProperty={indicator}
            zoomOnClick={false}
            isCustomColor={!Factors.includes(indicator)}
            customColor={colorScale}
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
                : riskValue;
              layer
                .bindPopup(
                  () => {
                    return `
                    <div>
                    <strong>${regionName.toUpperCase()}</strong><br/>
                    <span>${deSlugify(indicator)} : <span style="color: ${colorMap[riskValue]}; font-weight: bold; text-transform: uppercase;">${riskText}</span></span>
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
            }}
            mouseout={(layer) => {
              layer.closePopup();
              layer.unbindPopup();
            }}
            click={(layer) =>
              onMapClick({
                layer: layer,
                layerCode: layer.feature?.properties.code,
                revenueMapData: revenueMapData,
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
