import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button, Icon, Tag, Text } from 'opub-ui';

import { type Dataset } from '@/config/graphql/dataset-queries';
import { routes } from '@/lib/routes';
import { toTitleCase } from '@/lib/utils';
import Icons from '@/components/icons';

interface MetadataProps {
  data: Dataset | undefined;
  setOpen?: (isOpen: boolean) => void;
}

const MetadataComponent: React.FC<MetadataProps> = ({ data, setOpen }) => {
  const t = useTranslations('datasets');
  const filteredMetadataArray = (data?.metadata ?? []).filter(
    (item) =>
      item.metadataItem.label !== 'Source Website' &&
      item.metadataItem.label !== 'Github Repo Link' &&
      item.metadataItem.label !== 'Source' &&
      item.value.trim() !== '' // Ensure the value is not empty
  );

  return (
    <div className="rounded-md shadow-md flex flex-col gap-6 bg-surfaceDefault  px-6 py-4 lg:px-8 lg:py-6">
      <div className="flex items-center justify-between">
        <Text variant="headingMd" fontWeight="semibold">
          {t('detail.metadata.heading')}
        </Text>
        {setOpen && (
          <Button onClick={() => setOpen(false)} kind="tertiary">
            <Icon source={Icons.cross} size={24} color="default" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5 align-baseline">
        {filteredMetadataArray.map((item, index) => (
          <div
            className="flex items-center gap-2 border-b-2 border-solid border-baseGraySlateSolid6 pb-2"
            key={index}
          >
            <Text className="text-base font-medium min-w-[120px] basis-1/4">
              {toTitleCase(item.metadataItem.label)}:
            </Text>
            <Text className="text-base">{item.value}</Text>
          </div>
        ))}
        {(data?.formats.length ?? 0) > 0 && (
          <div className="flex items-baseline gap-2 border-b-2 border-solid border-baseGraySlateSolid6  pb-2">
            <Text className="text-base font-medium min-w-[120px] basis-1/4">
              {t('labels.formats')}
            </Text>
            <div className="flex flex-wrap gap-2">
              {data?.formats.map((item, index) => (
                <Tag key={index}>{item}</Tag>
              ))}
            </div>
          </div>
        )}
        {(data?.categories.length ?? 0) > 0 && (
          <div className="flex items-baseline gap-2 pb-2">
            <Text className="text-base font-medium min-w-[120px] basis-1/4">
              {t('labels.category')}
            </Text>
            <div className="flex flex-wrap gap-2">
              {data?.categories.map((item, index) => (
                <Link
                  href={routes.datasets({ category: item.name })}
                  target="_blank"
                  className="flex justify-center"
                  key={index}
                >
                  <Text className="underline" color="interactive">
                    {item.name}
                  </Text>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MetadataComponent;
