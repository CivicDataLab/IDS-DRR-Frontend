/** Very High Risk on the 1–5 Sendai scale used by map features. */
const VERY_HIGH_RISK_LEVEL = 5;

type MapFeature = {
  properties?: Record<string, unknown>;
};

type DistrictMapData = {
  features?: MapFeature[];
};

/** Count districts at very high risk from `districtMapData` GeoJSON features. */
export function countVeryHighRiskDistricts(
  mapData: DistrictMapData | null | undefined,
  indicator: string
): number | undefined {
  const features = mapData?.features;
  if (!features?.length) return undefined;

  return features.filter(
    (feature) => Number(feature.properties?.[indicator]) === VERY_HIGH_RISK_LEVEL
  ).length;
}

/** District count from `getDistrictRevCircle` geography list. */
export function countDistricts(
  districts: unknown[] | null | undefined
): number | undefined {
  if (!districts) return undefined;
  return districts.length;
}
