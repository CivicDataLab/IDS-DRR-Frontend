export const constructRegionOptions = (
  boundary: string,
  geographiesData: any
) => {
  let RevCircleDropdownOptions: {
    label: string;
    value: string;
    districtCode: string;
  }[] = [];
  let DistrictDropDownOption: {
    label: string;
    value: string;
    districtCode?: string;
  }[] = [];
  if (boundary === 'revenue-circle') {
    let rawData = geographiesData?.data?.getDistrictRevCircle;
    if (rawData) {
      for (const district in rawData) {
        const revenueCircles = rawData[district];
        revenueCircles.forEach(
          (circle: {
            'revenue-circle': string;
            code: string;
            district_code: string;
          }) => {
            RevCircleDropdownOptions.push({
              label: circle['revenue-circle'],
              value: circle.code,
              districtCode: circle['district_code'],
            });
          }
        );
      }
    }
    return RevCircleDropdownOptions;
  }
  geographiesData.data?.getDistrictRevCircle?.forEach(
    (geography: { district: string; code: string }) => {
      DistrictDropDownOption.push({
        label: geography.district,
        value: geography.code ? geography.code : 'NA',
      });
    }
  );
  return DistrictDropDownOption;
};

export function getFactorNameBySlug(factorData: any, slug: string) {
  const factorName = factorData?.filter(
    (factor: { slug: string }) => factor.slug === slug
  );
  return factorName[0]?.name;
}

export function getUnitsBySlug(factorData: any, slug: string) {
  const factorName = factorData?.filter(
    (factor: { slug: string }) => factor.slug === slug
  );
  return factorName[0]?.unit__name || '';
}

export function formatNumberToIndianSystem(input: number): string | number {
  if (input === undefined || input === null) {
    return ''; // Return an empty string or handle it as needed
  }
  // Extract the numeric part (including decimals)
  const match = input.toString().match(/[\d.]+/);
  if (!match) return input.toString(); // No number found, return original input

  let number = parseFloat(match[0]);

  // Handle NaN cases
  if (isNaN(number)) {
    return input.toString();
  }

  // Ensure 0.00 formatting
  if (number === 0) {
    return `0.00${input.toString().replace(match[0], '')}`;
  }

  const [integerPart, decimalPart] = number.toString().split('.');

  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);

  const formattedNumber =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherDigits ? ',' : '') +
    lastThreeDigits;

  const formatted = decimalPart
    ? `${formattedNumber}.${decimalPart}`
    : `${formattedNumber}.0`;

  // Append unit back if present
  const unit = input.toString().replace(match[0], '').trim();
  return unit ? `${formatted} ${unit}` : formatted;
}
