import { parseDate } from '@internationalized/date';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { MonthPicker, MultiMonthPicker, Select } from 'opub-ui';

import { formatDate, toTitleCase } from '@/lib/utils';
import { getLatestDate } from '../utils/utils';

export interface Option {
  disabled?: boolean;
  value: string;
  label: string;
  districtCode?: string; // extra field we don’t want leaking into DOM
}

export default function FilterDropdownOptions({
  currentSelectedState,
  RevCircleDropdownOptions,
  DistrictDropDownOption,
  monthMulti = false,
  timeLimits,
}: {
  currentSelectedState: any;
  RevCircleDropdownOptions: Option[];
  DistrictDropDownOption: Option[];
  monthMulti?: boolean;
  timeLimits: any;
}) {
  // console.log('timeLimits', timeLimits);
  const [districtCode, setDistrictCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [timePeriod] = useQueryState('time-period');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');

  const getRevenueCircleOptionsForDistrict = (districtCode: string) => {
    return RevCircleDropdownOptions.filter(
      (option: Option) => option.districtCode === districtCode
    );
  };

  // helper: strip out custom props like districtCode
  const sanitizeOptions = (options: Option[]) =>
    options.map(({ value, label, disabled }) => ({
      value,
      label,
      disabled,
    }));

  let minDate, maxDate;
  // Below is code to set limits to the calendar
  // console.log('timeLimits', timeLimits.data);
  if (timeLimits.data) {
    const datesArray = timeLimits?.data?.getDataTimePeriods.map((date: any) => {
      const [year, month] = date.value.split('_');
      return new Date(parseInt(year), parseInt(month));
    });
    const timestamps = datesArray.map((date: any) => date.getTime());
    // Find the minimum and maximum timestamps
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    // Convert the timestamps back to dates
    minDate = formatDate(minTimestamp, true);
    maxDate = formatDate(maxTimestamp, true);
  }

  const [selectedTimePeriod, setSelectedTimePeriod] = useQueryState<string[]>(
    'time-period',
    {
      parse: (value) => value.split(','),
    }
  );

  const districtOptions = sanitizeOptions([
    { label: 'Select a district', value: '' },
    ...DistrictDropDownOption,
  ]);

  const revenueOptions = sanitizeOptions([
    {
      label: !districtCode
        ? 'Select a district to enable'
        : `Select a ${toTitleCase(currentSelectedState.child_type)}`,
      value: '',
    },
    ...(getRevenueCircleOptionsForDistrict(districtCode) || []),
  ]);

  const getDefaultDate = (timePeriod: string) => {
    const [year, month] = timePeriod.split('_');
    return parseDate(`${year}-${month?.padStart(2, '0')}-01`);
  };

  return (
    <div>
      <div className="mb-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
        <Select
          label="Select District"
          value={districtCode || ''}
          name="district-select"
          className="flex-1"
          onChange={(e) => {
            setDistrictCode(e, { shallow: false });
            setRevenueCode('');
          }}
          options={districtOptions}
        />

        <Select
          label={`Select ${toTitleCase(currentSelectedState.child_type)}`}
          value={revenueCode || ''}
          name="revenue-circle-select"
          className="flex-1"
          disabled={!districtCode}
          onChange={(e) => {
            setRevenueCode(e, { shallow: false });
          }}
          options={revenueOptions}
        />

        <div className="flex-1">
          {monthMulti ? (
            <MultiMonthPicker
              // TODO: add support for name, className, minValue and maxValue in opub-ui
              // name="time-period-select"
              // className="flex-1"
              selectedValues={
                selectedTimePeriod
                  ?.filter(Boolean)
                  ?.map((timePeriod: string) => {
                    const [year, month] = timePeriod.split('_');
                    return parseDate(`${year}-${month.padStart(2, '0')}-01`);
                  }) || []
              }
              // defaultValues={getDefaultDate(timePeriod || '')}
              label="Select Months"
              minValue={parseDate(minDate || '2023-01-04')}
              maxValue={parseDate(maxDate || '2023-01-04')}
              onChange={(dates: any) => {
                setSelectedTimePeriod(
                  dates.map(
                    (date: any) =>
                      `${date.year}_${
                        date.month < 10 ? `0${date.month}` : `${date.month}`
                      }`
                  )
                );
              }}
            />
          ) : (
            <MonthPicker
              name="time-period-select"
              defaultValue={
                selectedTimePeriod &&
                selectedTimePeriod?.filter(Boolean)?.length > 0
                  ? parseDate(
                      getLatestDate(selectedTimePeriod || []) || '2023-08-01'
                    )
                  : getDefaultDate(timePeriod || '')
              }
              label="Select Month"
              minValue={parseDate(minDate || '2023-01-04')}
              maxValue={parseDate(maxDate || '2023-01-04')}
              onChange={(date: any) => {
                setSelectedTimePeriod(
                  [
                    `${date.year}_${
                      date.month < 10 ? `0${date.month}` : `${date.month}`
                    }`,
                  ],
                  { shallow: false }
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
