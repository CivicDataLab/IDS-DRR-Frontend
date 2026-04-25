'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, Icon, Menu, Spinner, Text, Tray } from 'opub-ui';

import { handleRedirect } from '@/lib/utils';
import { useCopyURL } from '@/hooks/use-copy-url';
import Icons from '@/components/icons';
import Metadata from '../Metadata';

interface PrimaryDataProps {
  data: any;
  isLoading?: boolean;
}
const currentURL = typeof window !== 'undefined' ? window.location.href : '';

const PrimaryData: React.FC<PrimaryDataProps> = ({ data, isLoading }) => {
  const t = useTranslations('datasets');
  const tCommon = useTranslations('common');
  const copyURL = useCopyURL();
  const sourceMetadata = data.metadata.find(
    (item: any) => item.metadataItem.label === 'Source'
  );
  const sourceLink = data.metadata.find(
    (item: any) => item.metadataItem.label === 'Source Website'
  );
  const githubLink = data.metadata.find(
    (item: any) => item.metadataItem.label === 'Github Repo Link'
  );

  const [open, setOpen] = useState(false);

  return (
    <div className=" flex flex-col gap-4 bg-surfaceDefault px-6 py-8 ">
      <div className="flex flex-col gap-1">
        <Text variant="headingLg">{data?.title}</Text>
        {sourceMetadata?.value && (
          <div className="flex flex-wrap items-center">
            <div className="flex gap-2">
              <Text>{t('labels.source')}</Text>
              <Text>{sourceMetadata.value}</Text>
            </div>
          </div>
        )}
        <div
          className="flex sm:block md:block lg:hidden"
          title={t('detail.about.heading')}
        >
          <Tray
            size="narrow"
            open={open}
            onOpenChange={setOpen}
            trigger={
              <div>
                <Button
                  kind="tertiary"
                  className="lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <div className="flex items-center gap-2 py-2">
                    <Icon source={Icons.info} size={24} color="default" />
                    <Text>{t('detail.metadata.heading')}</Text>
                  </div>
                </Button>
              </div>
            }
          >
            {isLoading ? (
              <div className=" mt-8 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <Metadata data={data} setOpen={setOpen} />
            )}
          </Tray>
        </div>
      </div>

      <div>
        <Text variant="bodyMd">{data?.description}</Text>
      </div>
      <div className="flex flex-wrap gap-6 pt-2">
        {sourceLink?.value && (
          <div>
            <Link
              href={sourceLink.value}
              onClick={(event) => handleRedirect(event, sourceLink.value)}
              className="flex gap-1 text-textInteractive underline"
            >
              <Text color="interactive">{t('detail.metadata.sourceLink')}</Text>
              <Icon source={Icons.link} color="interactive" />
            </Link>
          </div>
        )}
        {githubLink?.value && (
          <div>
            <Link
              href={githubLink.value}
              onClick={(event) => handleRedirect(event, githubLink.value)}
              className="flex gap-1 text-textInteractive underline"
            >
              <Text color="interactive">{t('detail.metadata.githubLink')}</Text>
              <Icon source={Icons.link} color="interactive" />
            </Link>
          </div>
        )}
        <div className="flex content-start items-start">
          <Menu
            trigger={
              <Button monochrome={true} kind="tertiary">
                <div className="flex items-center gap-1">
                  <Text
                    color="interactive"
                    variant="bodyMd"
                    className=" underline"
                  >
                    {t('detail.share')}
                  </Text>
                  <Icon source={Icons.share} color="interactive" />
                </div>
              </Button>
            }
            items={[
              {
                content: tCommon('social.facebook'),
                icon: Icons.IconBrandFacebook,
                onAction: () =>
                  window.open(
                    `https://www.facebook.com/sharer.php?u=${currentURL}/`
                  ),
              },
              {
                content: tCommon('social.linkedin'),
                icon: Icons.IconBrandLinkedin,
                onAction: () =>
                  window.open(
                    `https://www.linkedin.com/shareArticle?url=${currentURL}/`
                  ),
              },
              {
                content: tCommon('social.twitter'),
                icon: Icons.IconBrandX,
                onAction: () =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${currentURL}/`
                  ),
              },
              {
                content: tCommon('copy.trigger'),
                icon: Icons.link,
                onAction: () => copyURL(),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryData;
