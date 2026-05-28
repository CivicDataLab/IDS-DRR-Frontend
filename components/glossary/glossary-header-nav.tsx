'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Icon, Text } from 'opub-ui';

import { docsLink, userManualLink } from '@/config/site';
import Icons from '../icons';

export default function GlossaryHeaderNav() {
  const t = useTranslations('glossary');
  return (
    <div className="flex items-center gap-5">
      {userManualLink && (
        <Link
          href={userManualLink}
          target="_blank"
          className="h-10 rounded-1 bg-[#2C6ECB] p-2 pb-2 text-[#fff] hover:bg-[#2C6ECB]/80"
        >
          <div className="flex items-end justify-center gap-2">
            <Text variant="bodyLg" fontWeight="medium" className="text-[#fff]">
              {t('userManualLink')}
            </Text>
            <Icon
              source={Icons.externalLink}
              size={24}
              color="onBgDefault"
            />
          </div>
        </Link>
      )}
      {docsLink && (
        <Link
          href={docsLink}
          target="_blank"
          className="h-10 rounded-1 bg-[#2C6ECB] p-2 text-[#fff] hover:bg-[#2C6ECB]/80"
        >
          <div className="flex items-end justify-center gap-2">
            <Text variant="bodyLg" fontWeight="medium" className="text-[#fff]">
              {t('docsLink')}
            </Text>
            <Icon
              source={Icons.externalLink}
              size={24}
              color="onBgDefault"
            />
          </div>
        </Link>
      )}
    </div>
  );
}
