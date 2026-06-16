/**
 * A payload from a GraphQL JSON-scalar field or an untyped REST response —
 * intentionally dynamic (map GeoJSON, table rows keyed by indicator slug,
 * echarts options, etc.). Prefer a real type when the shape is fixed (see
 * State/Indicator/Dataset); reach for this only for genuinely open-ended data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonScalar = any;
