'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, Text } from 'opub-ui';

import { documentationLink } from '@/config/consts';
import Icons from '../icons';

export default function GlossaryHeaderNav() {
  return (
    <div className="flex items-center gap-5">
      <Link
        href="https://ids-drr-user.readthedocs.io/en/latest/"
        target="_blank"
        className="h-10 rounded-1 bg-[#2C6ECB] p-2 pb-2 text-[#fff] hover:bg-[#2C6ECB]/80"
      >
        <div className="flex items-end justify-center gap-2">
          <Text variant="bodyLg" fontWeight="medium" className="text-[#fff]">
            User Manual
          </Text>
          <Icon
            source={Icons.externalLink}
            size={24}
            color="onBgDefault"
            // className="text-textOnBGDefault"
          />
        </div>
      </Link>
      <Link
        href={documentationLink}
        target="_blank"
        className="h-10 rounded-1 bg-[#2C6ECB] p-2 text-[#fff] hover:bg-[#2C6ECB]/80"
      >
        <div className="flex items-end justify-center gap-2">
          <Text variant="bodyLg" fontWeight="medium" className="text-[#fff]">
            Full Documentation
          </Text>
          <Icon
            source={Icons.externalLink}
            size={24}
            color="onBgDefault"
            // className="text-textOnBGDefault"
          />
        </div>
      </Link>
    </div>
  );
}
