'use client';

import React, { useState } from 'react';
import { Button, Icon, Text } from 'opub-ui';

import { copyCurrentURL } from '@/lib/utils';
import Icons from '@/components/icons';
import { Content } from './analytics-layout';
import { OutputWindowComponent } from './analytics-sidebar-layout';
import { FactorList } from './factor-list';
import { FilterComp } from './filter-component';

export function AnalyticsMobileLayout({
  timePeriod,
  indicator,
}: {
  timePeriod: string;
  indicator: string;
}) {
  const [componentToShow, setComponentToShow] = useState(
    <OutputWindowComponent />
  );

  const handleMapClick = () => {
    setComponentToShow(
      <Content timePeriod={timePeriod} indicator={indicator} />
    );
  };

  const handleAnalyticsClick = () => {
    setComponentToShow(<OutputWindowComponent />);
  };

  const buttons = [
    {
      icon: Icons.IconMap,
      text: 'Map',
      onClick: handleMapClick,
    },
    {
      icon: Icons.IconChartBar,
      text: 'Analytics',
      onClick: handleAnalyticsClick,
    },
    {
      icon: Icons.share,
      text: 'Share',
      onClick: copyCurrentURL,
    },
  ];

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-0 bg-[#FFFF]">
      <div className="flex h-[110vh] w-[95vw] flex-grow flex-col overflow-auto overflow-y-scroll">
        <div className="flex items-center">
          <FactorList />
          <FilterComp timePeriod={timePeriod} />
        </div>
        {componentToShow}
      </div>

      <div className="flex w-full flex-row bg-baseIndigoSolid1 ">
        {buttons.map((button, index) => (
          <Button
            key={index}
            size="slim"
            className=" flex flex-1  border-t-1 border-solid border-borderSubdued p-4"
            kind="tertiary"
            onClick={button.onClick}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <Icon source={button.icon} size={24} />
              <Text
                variant="headingMd"
                fontWeight="medium"
                className="text-textSubdued"
              >
                {button.text}
              </Text>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}
