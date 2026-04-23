/** @type {import('next-sitemap').IConfig} */

const site = require('./config/site.generated.json');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  siteUrl: dev ? 'http://localhost:3000' : process.env.SITE_URL,

  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const activeStates = (site.states || []).filter(
      (s) => s.status === 'active'
    );
    const views = ['map', 'table', 'chart'];
    const lastmod = new Date().toISOString();

    return activeStates.flatMap((state) =>
      views.map((view) => ({
        loc: `/en/${state.slug}/analytics?indicator=risk-score&view=${view}`,
        changefreq: 'daily',
        priority: 1,
        lastmod,
      }))
    );
  },
};
