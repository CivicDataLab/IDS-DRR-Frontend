export const constructRegionOptions = (
  boundary: string,
  geographiesData: any
) => {
  let RevCircleDropdownOptions: { label: string; value: string }[] = [];
  let DistrictDropDownOption: { label: string; value: string }[] = [];
  if (boundary === 'revenue-circle') {
    let rawData = geographiesData?.data?.getDistrictRevCircle;
    if (rawData) {
      for (const district in rawData) {
        const revenueCircles = rawData[district];
        revenueCircles.forEach(
          (circle: { 'revenue-circle': string; code: string }) => {
            RevCircleDropdownOptions.push({
              label: circle['revenue-circle'],
              value: circle.code,
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
