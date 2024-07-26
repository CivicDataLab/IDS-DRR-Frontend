const config = {
  STATE_NAME: 'Himachal Pradesh',
  STATE_CODE: '02',
  REVENUE_CIRCLE_TYPE: 'sub-district',
  ANALYTICS_URL:
    '/analytics/?indicator=risk-score&time-period=2023_08&boundary=sub-district',
  NAVBAR_CONFIG: {
    homeUrl: '/',
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Datasets',
        href: '/datasets',
      },
      {
        title: 'Analytics',
        href: '/analytics/?indicator=risk-score&time-period=2023_08&boundary=sub-district',
      },
      {
        title: 'About us',
        href: '/about-us',
      },
    ],
  },
  HERO_IMAGE: {
    path: '/logo/hpDRRLogo.png',
    altText: 'Himachal Pradesh DRR Dashboard',
  },
};

module.exports = config;
