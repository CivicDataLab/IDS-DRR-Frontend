import {
  REVENUE_CIRCLE_TYPES,
  RevenueCircleData,
} from '../components/analytics-layout';

export const constructRegionOptions = (
  boundary: string,
  geographiesData: any
) => {
  let RevCircleDropdownOptions: { label: string; value: string }[] = [];
  let DistrictDropDownOption: { label: string; value: string }[] = [];
  if (REVENUE_CIRCLE_TYPES.includes(boundary)) {
    let rawData = geographiesData?.data?.getDistrictRevCircle;
    if (rawData) {
      for (const district in rawData) {
        const revenueCircles = rawData[district];
        revenueCircles.forEach((circle: RevenueCircleData) => {
          if ('revenue-circle' in circle) {
            RevCircleDropdownOptions.push({
              label: circle['revenue-circle'],
              value: circle.code,
            });
          } else if ('sub-district' in circle) {
            RevCircleDropdownOptions.push({
              label: circle['sub-district'],
              value: circle.code,
            });
          }
        });
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
