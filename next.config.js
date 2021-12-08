/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const hash = require('string-hash');
const { relative } = require('path');

const context = __dirname;

module.exports = {
  reactStrictMode: true,
  
  webpack: (config) => {
    config.module.rules.push({
      test: /\.stories.tsx$/,
      loader: 'ignore-loader'
    });

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ({ resource }) => ({
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              { 
                name: "cleanupIDs",
                params: {
                  prefix: `svg${hash(relative(context, resource))}`
                }
              }
            ]
          }
        }
      })
    });

    return config;
  },
  i18n
};
