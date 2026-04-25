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

//analytics page
// Note: time-period is omitted to default to the latest available data (getDataTimePeriods[0].value)
const AnalyticsURL = `/analytics/?indicator=risk-score&view=map`;
const learnMoreLink = `https://drive.google.com/file/d/1TerjJtQrWxziKJ1E5BvfvRELtWJWRw2M/view?usp=drive_link`;
const documentationLink = `https://ids-drr.readthedocs.io/en/latest/architecture/overview.html`;

export {
  AnalyticsURL,
  RiskColorMap,
  Factors,
  learnMoreLink,
  documentationLink,
};
