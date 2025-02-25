/** @type {import('next-sitemap').IConfig} */

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  siteUrl: dev ? 'http://localhost:3000' : process.env.SITE_URL,

  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const result = [];

    result.push({
      loc: '/en/assam/analytics?indicator=risk-score&view=map',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date().toISOString(),
    });
    result.push({
      loc: '/en/assam/analytics?indicator=risk-score&view=table',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date().toISOString(),
    });
    result.push({
      loc: '/en/assam/analytics?indicator=risk-score&view=chart',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date().toISOString(),
    });

    return result;
  },
};
