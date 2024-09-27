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
