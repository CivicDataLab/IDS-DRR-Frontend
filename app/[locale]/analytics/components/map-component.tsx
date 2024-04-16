'use client';

import React from 'react';
import { Spinner, Text } from 'opub-ui';

import MapChart from '@/components/MapChart';
import { FactorList } from './factor-list';

export const MapComponent = ({
  indicator,
  regions,
  mapDataloading,
  mapData,
  setRegion,
}: {
  indicator: string;
  regions: { label: string; value: string }[];
  mapDataloading: boolean;
  mapData: any;
  setRegion: any;
}) => {
  const [map, setMap] = React.useState<any>(null);
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

  const onMapClick = ({ layer }: { layer: string }) => {
    setRegion((prev: any) => {
      if (prev === null) {
        return [layer];
      } else {
        return [...prev, layer];
      }
    });
  };

  React.useEffect(() => {
    const regionsArray: string[] = [];
    regions?.forEach((region) => {
      regionsArray.push(region.value);
    });

    if (map) {
      const openPopups: any[] = [];
      map.options.maxZoon = 10;

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
  }, [indicator, map, regions]);

  if (mapDataloading)
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>Loading...</Text>
      </div>
    );

  return (
    <div className=" relative h-[90%] w-full py-4">
      <FactorList />
      <MapChart
        features={mapData?.features}
        mapZoom={7.7}
        mapProperty={indicator}
        zoomOnClick={false}
        legendData={legendData}
        minZoom={6}
        maxZoom={8}
        mapDataFn={mapDataFn}
        click={(layer) =>
          onMapClick({
            layer: layer.feature?.properties.code,
          })
        }
        fillOpacity={1}
        setMap={setMap}
        resetZoom
        scroolWheelZoom={false}
      />
    </div>
  );
};
