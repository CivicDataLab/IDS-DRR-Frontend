//General
const RiskColorMap: {
  [key: number]: {
    backgroundColor: string;
    indicatorColor: string;
  };
} = {
  5: {
    backgroundColor: '#d416057a',
    indicatorColor: '#D41505',
  },
  4: {
    backgroundColor: '#fb8b357a',
    indicatorColor: '#FB8C35',
  },
  3: {
    backgroundColor: '#ffee6e82',
    indicatorColor: '#FFED6E',
  },
  2: {
    backgroundColor: '#65a4bd77',
    indicatorColor: '#65A4BD',
  },
  1: {
    backgroundColor: '#4575b480',
    indicatorColor: '#4575B4',
  },
};

const Factors = [
  'risk-score',
  'flood-hazard',
  'vulnerability',
  'government-response',
  'exposure',
];

const RiskText: {
  [key: number]: {
    indicatorText: string;
  };
} = {
  5: {
    indicatorText: 'Very High Risk',
  },
  4: {
    indicatorText: 'High Risk',
  },
  3: {
    indicatorText: 'Medium  Risk',
  },
  2: {
    indicatorText: 'Low Risk',
  },
  1: {
    indicatorText: 'Very Low Risk',
  },
};

// Datasets page
const DatasetsURL = `/datasets?size=5&page=1&sort=recent`;

//analytics page
// Note: time-period is omitted to default to the latest available data (getDataTimePeriods[0].value)
const AnalyticsURL = `/analytics/?indicator=risk-score&view=map`;
const learnMoreLink = `https://drive.google.com/file/d/1TerjJtQrWxziKJ1E5BvfvRELtWJWRw2M/view?usp=drive_link`;
const documentationLink = `https://ids-drr.readthedocs.io/en/latest/architecture/overview.html`;
//home page
const AboutUsURL = '/about-us';

const HeroSectionText = 'Discover insights, assess risks and build resilience';

const AnalyticsQuickLinksText =
  'Explore flood-risk profiles at the district and sub-district level across states in India, developed using the IDS-DRR data model';

const DatasetCatalogText = 'Explore and use high-value datasets';

const ResourcesSectionText = 'Browse through the featured datasets';

export {
  AnalyticsURL,
  DatasetsURL,
  HeroSectionText,
  RiskColorMap,
  RiskText,
  Factors,
  AnalyticsQuickLinksText,
  AboutUsURL,
  learnMoreLink,
  documentationLink,
  DatasetCatalogText,
  ResourcesSectionText,
};
