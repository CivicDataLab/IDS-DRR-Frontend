'use client';

import { useMediaQuery } from '@/hooks/use-media-query';

export const MediaRendering = ({
  minWidth,
  maxWidth,
  children,
}: {
  minWidth: string | null;
  maxWidth: string | null;
  children: React.ReactNode;
}) => {
  const minDeviceSize = useMediaQuery(`(min-width: ${minWidth}px)`);
  const maxDeviceSize = useMediaQuery(`(max-width: ${maxWidth}px)`);

  return <>{(maxDeviceSize || minDeviceSize) && children}</>;
};
