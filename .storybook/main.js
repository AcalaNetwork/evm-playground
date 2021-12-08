const hash = require('string-hash');
const path = require('path');
const fs = require('fs');

const context = __dirname;

function getPackageDir(filepath) {
  let currDir = path.dirname(require.resolve(filepath));
  while (true) {
    if (fs.existsSync(path.join(currDir, 'package.json'))) {
      return currDir;
    }
    const { dir, root } = path.parse(currDir);
    if (dir === root) {
      throw new Error(`Could not find package.json in the parent directories starting from ${filepath}.`);
    }
    currDir = dir;
  }
}

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.resolve.alias = {
      '@emotion/core': getPackageDir('@emotion/react'),
      '@emotion/styled': getPackageDir('@emotion/styled'),
      'emotion-theming': getPackageDir('@emotion/react')
    };

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    const svgLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));
    svgLoaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.svg$/,
      use: ({ resource }) => ({
        loader: require.resolve('@svgr/webpack'),
        enforce: 'pre',
        options: {
          svgoConfig: {
            plugins: [
              {
                cleanupIDs: {
                  prefix: `svg${hash(path.relative(context, resource))}`
                }
              }
            ]
          }
        }
      })
    });

    return config;
  }
};
