'use client';

import React, { useEffect, useState } from 'react';
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
  setRegion,
  boundary,
  geographiesData,
  RevCircleDropdownOptions,
  DistrictDropDownOption,
  selectedGroup,
  setSelectedGroup,
  setDistrictDropDownOption,
}: {
  indicator: string;
  regions: { label: string; value: string }[];
  mapDataloading: boolean;
  mapData: any;
  setRegion: any;
  boundary: string;
  geographiesData: any;
  RevCircleDropdownOptions: any;
  DistrictDropDownOption: any;
  selectedGroup: any;
  setSelectedGroup: (group: string[]) => void; // New prop to update selectedGroup
  setDistrictDropDownOption: (options: any[]) => void; // New prop to update dropdown
}) => {
  const [map, setMap] = React.useState<any>(null);
  const { width } = useWindowSize();

  const [dist, setDist] = React.useState('');

  var rc: any;

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
    { label: 'Very High Risk', color: '#D41505' },
    { label: 'High Risk', color: '#FB8C35' },
    { label: 'Medium Risk', color: '#FFED6E' },
    { label: 'Low Risk', color: '#65A4BD' },
    { label: 'Very Low Risk', color: '#4575b4' },
  ];

  const onMapClick = ({ layer }: { layer: string }) => {
    setRegion((prev: any) => {
      if (prev?.length >= 4) {
        alert('Only 4 regions are allowed');
        return [...prev];
      }
      if (width < 768) {
        return [layer];
      }
      if (prev === null || prev.length === 0) {
        // First selection logic
        const selectedRC = RevCircleDropdownOptions.find(
          (option: any) => option.value === layer
        );
        const associatedDistrict = selectedRC ? selectedRC.type : null;

        if (associatedDistrict) {
          // Update the selected group to include the associated district
          setSelectedGroup([associatedDistrict]);
          // setDist(associatedDistrict);

          // Disable all districts except the associated one
          setDistrictDropDownOption(
            DistrictDropDownOption.map((option: any) => ({
              ...option,
              disabled: option.value !== associatedDistrict,
            }))
          );
          rc = associatedDistrict;
        }

        return [layer];
      } else {
        // Check if the new selection is within the same district

        const selectedRC = RevCircleDropdownOptions.find(
          (option: any) => option.value === layer
        );

        const selectedDistrict = selectedRC ? selectedRC.type : null;

        if (selectedDistrict && selectedDistrict !== rc) {
          alert(
            `You cannot select a revenue circle outside of the selected district.`
          );
          return [...prev];
        }

        return [...new Set([...prev, layer])];
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
                () => `<span>${regionName}: ${riskValue}<br/></span>`,
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
    <>
      {/* Mobile View */}
      <MediaRendering minWidth={null} maxWidth="1023">
        <div className="relative h-full w-full pt-[62px]">
          <MapChart
            features={mapData?.features}
            mapZoom={6}
            minZoom={5}
            maxZoom={8}
            mapProperty={indicator}
            zoomOnClick={false}
            legendData={legendData}
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
      </MediaRendering>
      {/* Desktop View */}
      <MediaRendering minWidth="1024" maxWidth={null}>
        <div className="relative h-[90%] w-full py-4">
          <FactorList />
          <MapChart
            features={mapData?.features}
            mapZoom={7.4}
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
      </MediaRendering>
    </>
  );
};
