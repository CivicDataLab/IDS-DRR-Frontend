const config = {
  STATE_NAME: 'Assam',
  STATE_CODE: '18',
  REVENUE_CIRCLE_TYPE: 'revenue-circle',
  ANALYTICS_URL:
    '/analytics/?indicator=risk-score&time-period=2023_08&boundary=district',
  NAVBAR_CONFIG: {
    homeUrl: '/',
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Analytics',
        href: '/analytics/?indicator=risk-score&time-period=2023_08&boundary=district',
      },
      {
        title: 'Datasets',
        href: '/datasets',
      },
      {
        title: 'About us',
        href: '/about-us',
      },
    ],
  },
  HERO_IMAGE: {
    path: '/logo/assamDRRLogo.svg',
    altText: 'Assam DRR Dashboard',
  },
};

module.exports = config;
