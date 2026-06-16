import {
  type Indicator,
  type State,
} from '@/config/graphql/analaytics-queries';
import { type Dataset } from '@/config/graphql/dataset-queries';

/**
 * Build a complete `State` fixture, overriding only the fields a test
 * cares about. Keeps tests from having to spell out every `State` field.
 */
export const makeState = (overrides: Partial<State> = {}): State => ({
  name: '',
  slug: '',
  code: '',
  center: null,
  bounds: null,
  child_type: null,
  resource_id: '',
  time_periods: [],
  latest_time_period: null,
  ...overrides,
});

/**
 * Build a complete `Indicator` fixture, overriding only the fields a test
 * cares about.
 */
export const makeIndicator = (overrides: Partial<Indicator> = {}): Indicator => ({
  name: '',
  slug: '',
  long_description: null,
  short_description: null,
  unit__name: null,
  IDS_dataSpace: null,
  ...overrides,
});

/**
 * Build a complete `Dataset` fixture, overriding only the fields a test
 * cares about.
 */
export const makeDataset = (overrides: Partial<Dataset> = {}): Dataset => ({
  id: '',
  title: '',
  description: '',
  created: '',
  modified: '',
  formats: [],
  tags: [],
  metadata: [],
  resources: [],
  categories: [],
  ...overrides,
});
