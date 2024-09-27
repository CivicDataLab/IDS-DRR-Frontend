import { Divider, Tag, Text } from 'opub-ui';

export interface Metadata {
  lastUpdated: string;
  updateFrequency: string;
  fileTypes?: string[];
  tags: string[];
  licenses: (string | 'NA')[];
}

export function MetadataCard({
  lastUpdated,
  updateFrequency,
  fileTypes,
  tags,
  licenses,
}: Metadata) {
  const uniqueFileTypes = new Set(fileTypes);
  const fileTypesArray = Array.from(uniqueFileTypes);
  return (
    <div className="flex  flex-grow basis-[350px] flex-col gap-6 bg-surfaceDefault px-6 py-4 ">
      <Text variant="headingMd" fontWeight="semibold">
        Metadata
      </Text>
      <dl>
        <DataList label={'Last Updated'} value={lastUpdated || 'NA'} />
        <DataList label={'Update Frequency'} value={updateFrequency || 'NA'} />
        <DataList label={'Additional Tags'} value={tags || 'NA'} />
        <DataList label={'File types'} value={fileTypesArray || 'NA'} />
        <DataList label={'Licenses'} value={licenses || 'NA'} />
      </dl>
    </div>
  );
}

export const DataList = ({
  label,
  value,
}: {
  label: string;
  value: string[] | string;
}) => {
  return (
    <div className="flex flex-col pb-5">
      <div className="border-baseGraySlateSolid12a flex items-center gap-1 self-stretch border-b-1 py-2   ">
        <dt className="min-w-[50%]">
          <Text fontWeight="medium" variant="headingSm">
            {label} :
          </Text>
        </dt>
        <dd className="flex  flex-wrap items-center gap-1">
          {Array.isArray(value) ? (
            value.map((tag, index) => <Tag key={index}>{tag}</Tag>)
          ) : (
            <Text variant="bodyMd">{value}</Text>
          )}
        </dd>
      </div>
      <Divider className="mt-0" />
    </div>
  );
};
