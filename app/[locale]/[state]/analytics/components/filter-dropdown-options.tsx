import { parseAsString, useQueryState } from 'next-usequerystate';
import { Select } from 'opub-ui';

import { toTitleCase } from '@/lib/utils';

export interface Option {
  disabled?: boolean;
  value: string;
  label: string;
  districtCode?: string;
}

export default function FilterDropdownOptions({
  currentSelectedState,
  RevCircleDropdownOptions,
  DistrictDropDownOption,
}: {
  currentSelectedState: any;
  RevCircleDropdownOptions: Option[];
  DistrictDropDownOption: Option[];
}) {
  const [districtCode, setDistrictCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');

  const getRevenueCircleOptionsForDistrict = (districtCode: string) => {
    const filterRevenueCircles = RevCircleDropdownOptions.filter(
      (option: Option) => option.districtCode === districtCode
    );

    filterRevenueCircles.unshift({ label: '', value: '' });

    return filterRevenueCircles;
  };

  return (
    <>
      <Select
        label="Select District"
        value={districtCode || ''}
        name="district-select"
        className=" flex-grow"
        onChange={(e) => {
          setDistrictCode(e, { shallow: false });
          setRevenueCode('');
        }}
        options={DistrictDropDownOption}
      />
      <Select
        label={`Select ${toTitleCase(currentSelectedState.child_type)}`}
        value={revenueCode || ''}
        placeholder={
          !districtCode
            ? 'Select a district to enable'
            : `Select a ${toTitleCase(currentSelectedState.child_type)}`
        }
        name="revenue-circle-select"
        className=" flex-grow"
        disabled={!districtCode}
        onChange={(e) => {
          setRevenueCode(e, { shallow: false });
        }}
        options={getRevenueCircleOptionsForDistrict(districtCode) || []}
      />
    </>
  );
}
