'use client';

import React from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { Spinner, Text } from 'opub-ui';

import MapChart from '@/components/MapChart';
import { MediaRendering } from '@/components/media-rendering';
import { FactorList } from './factor-list';

export const MapComponent = ({
  indicator,
  regions,
  mapDataloading,
  mapData,
  revenueMapData,
  setRegion,
  boundary,
  setBoundary,
}: {
  indicator: string;
  regions: { label: string; value: string }[];
  mapDataloading: boolean;
  mapData: any;
  revenueMapData: any;
  setRegion: any;
  boundary: string;
  setBoundary: any;
}) => {
  const [map, setMap] = React.useState<any>(null);
  const [mapBounds, setMapBounds] = React.useState<any>(null);
  const [mapFeatures, setMapFeatures] = React.useState<any>(mapData.features);

  const { width } = useWindowSize();
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

  const onMapClick = ({
    layer,
    layerCode,
    revenueMapData,
  }: {
    layer: any;
    layerCode: string;
    revenueMapData: any;
  }) => {
    const bounds = layer._bounds;
    setMapBounds(bounds);
    const filterMapData = revenueMapData.features.filter(
      (feature: { properties: { [x: string]: string } }) =>
        feature.properties['district-code'] === layerCode
    );

    setMapFeatures(filterMapData);

    setRegion((prev: any) => {
      if (prev?.length >= 4) {
        alert('Only 4 regions are allowed');
        return [...prev];
      }
      if (width < 768) {
        return [layerCode];
      }
      if (prev === null) {
        return [layerCode];
      } else {
        return [...new Set([...prev, layerCode])];
      }
    });
  };

  React.useEffect(() => {
    const regionsArray: string[] = [];
    regions?.forEach((region) => {
      regionsArray.push(region.value);
    });

    if (map) {
      if (regions.length === 0) {
        console.log('Map center', map.getCenter());
        // const center = map.getCenter();
        setMapFeatures(mapData.features);
        map.setView([26.193, 92.773], 7.4);
      }
      const Bounds = mapBounds || map.getBounds();
      const openPopups: any[] = [];
      regions.length !== 0 &&
        map.fitBounds(Bounds, {
          padding: [500, 500], // Adds padding in pixels to all sides (e.g., 50px)
        });

      map.eachLayer((layer: any) => {
        const regionName = layer.feature?.properties.name;
        const regionCode = layer.feature?.properties.code;
        const riskValue = layer.feature?.properties?.[indicator];

        if (regionsArray.includes(regionCode)) {
          const popup = layer.getPopup();
          if (popup) {
            openPopups.push(popup);
          } else {
            layer
              .bindPopup(
                () => {
                  return `<span>${regionName}: ${riskValue}<br/></span>`;
                },
                {
                  maxWidth: 200,
                  closeButton: false,
                  autoClose: false,
                  closeOnEscapeKey: false,
                  closeOnClick: false,
                  id: `${regionName}`,
                  className: 'opub-leaflet-popup',
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
  }, [indicator, mapBounds, map, regions]);

  if (mapDataloading)
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
        <div className=" relative h-[90%] w-full py-4">
          <MapChart
            features={mapFeatures || mapData.features}
            mapZoom={7.4}
            mapProperty={indicator}
            zoomOnClick={false}
            legendData={legendData}
            minZoom={6}
            maxZoom={8}
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
    </>
  );
};
