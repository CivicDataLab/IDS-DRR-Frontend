import { parseDate, type CalendarDate } from '@internationalized/date';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { MonthPicker, MultiMonthPicker, Select } from 'opub-ui';

import { toTitleCase } from '@/lib/utils';
import { getLatestDate, safeParseDate } from '../utils/utils';

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
  timeLimits: string[];
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

  // Derive min/max directly from `YYYY_MM` strings to avoid timezone issues
  // (using Date/toISOString can shift to previous day/month).
  let minPeriod: string | undefined;
  let maxPeriod: string | undefined;
  if (Array.isArray(timeLimits) && timeLimits.length > 0) {
    const normalized = timeLimits
      .filter(Boolean)
      .filter((p) => /^\d{4}_\d{2}$/.test(p))
      .sort(); // lexical sort works for YYYY_MM
    minPeriod = normalized[0];
    maxPeriod = normalized[normalized.length - 1];
  }

  const minValue = minPeriod
    ? (() => {
        const [y, m] = minPeriod!.split('_');
        return parseDate(`${y}-${m}-01`);
      })()
    : parseDate('2023-01-04');

  const maxValue = maxPeriod
    ? (() => {
        const [y, m] = maxPeriod!.split('_');
        return parseDate(`${y}-${m}-01`);
      })()
    : parseDate('2023-01-04');

  const [selectedTimePeriod, setSelectedTimePeriod] = useQueryState<string[]>(
    'time-period',
    {
      parse: (value) => value.split(','),
    }
  );
  // Defensive coercion: useQueryState shares state across hook instances
  // by URL key, and the `time-period` param is also read elsewhere as a
  // plain string. On URL transitions the parsed-array hook can briefly
  // see a string. Always normalize to an array before consumption.
  const periods: string[] = Array.isArray(selectedTimePeriod)
    ? selectedTimePeriod.filter(Boolean)
    : [];

  const districtOptions = sanitizeOptions([
    { label: 'Select a district', value: '' },
    ...DistrictDropDownOption,
  ]);

  const revenueOptions = sanitizeOptions([
    {
      label: !districtCode
        ? 'Select a district to enable'
        : `Select a ${toTitleCase(currentSelectedState.child_type) || 'region'}`,
      value: '',
    },
    ...(getRevenueCircleOptionsForDistrict(districtCode) || []),
  ]);

  const getDefaultDate = (timePeriod?: string | string[] | null) => {
    let fallback: string | string[] | null | undefined =
      timePeriod ||
      currentSelectedState?.latest_time_period ||
      timeLimits?.[0] ||
      (process.env.NEXT_PUBLIC_TIME_PERIOD as string) ||
      '2023_01';

    // Handle cases where fallback might be an array (e.g. from parsed query state)
    if (Array.isArray(fallback)) {
      fallback = fallback[0] || '2023_01';
    }

    if (typeof fallback !== 'string') {
      fallback = '2023_01';
    }

    const [year, month] = fallback.split('_');
    return parseDate(`${year}-${month?.padStart(2, '0')}-01`);
  };

  // Compute a controlled value for MonthPicker so it stays in sync with URL updates.
  // When the user has explicitly cleared the time-period (empty string in URL),
  // do not fall back to the latest date – leave the picker empty so the label acts as a placeholder.
  const hasExplicitEmptyTimePeriod = timePeriod === '';
  const monthPickerValue =
    periods.length > 0
      ? safeParseDate(getLatestDate(periods) || '2023-08-01')
      : hasExplicitEmptyTimePeriod
        ? undefined
        : getDefaultDate(timePeriod);

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
          label={`Select ${toTitleCase(currentSelectedState.child_type) || 'Region'}`}
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
              selectedValues={periods
                .map((timePeriod: string) => {
                  const [year, month] = timePeriod.split('_');
                  return safeParseDate(`${year}-${month?.padStart(2, '0')}-01`);
                })
                .filter((d): d is CalendarDate => d !== undefined)}
              // defaultValues={getDefaultDate(timePeriod || '')}
              label="Select Months"
              minValue={minValue}
              maxValue={maxValue}
              onChange={(dates: any) => {
                if (!dates || dates.length === 0) {
                  // Allow clearing all selected months without breaking the view.
                  setSelectedTimePeriod([], { shallow: false });
                  return;
                }

                setSelectedTimePeriod(
                  dates.map(
                    (date: any) =>
                      `${date.year}_${
                        date.month < 10 ? `0${date.month}` : `${date.month}`
                      }`
                  ),
                  { shallow: false }
                );
              }}
            />
          ) : (
            <MonthPicker
              name="time-period-select"
              value={monthPickerValue}
              label="Select Month"
              minValue={minValue}
              maxValue={maxValue}
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
