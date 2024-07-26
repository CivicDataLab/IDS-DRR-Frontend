const fs = require('fs');
const path = require('path');

const env = process.env.DEPLOYMENT || 'as'; // Default to 'as' i.e assam if DEPLOYMENT is not set

const config = require(`../config/deployments/config.${env}`);

function generateDynamicConfig() {
  const dynamicConfig = {
    ...config,
    generatedAt: new Date().toISOString(),
    // Add more dynamic properties here if needed
  };

  fs.writeFileSync(
    path.resolve(__dirname, '../config/environment.js'),
    `module.exports = ${JSON.stringify(dynamicConfig, null, 2)};`
  );
}

generateDynamicConfig();
