const { useBabelRc, override } = require('customize-cra');

module.exports = override(useBabelRc(), function overrideWebpack(config, env) {
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });


  // config.module.rules.push({
  //   test: /\.svg$/,
  //   use: ({ resource }) => ({
  //     loader: '@svgr/webpack',
  //     options: {
  //       svgoConfig: {
  //         plugins: [
  //           {
  //             name: "cleanupIDs",
  //             params: {
  //               prefix: `svg${hash(relative(context, resource))}`
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   })
  // });

  return config;
});
