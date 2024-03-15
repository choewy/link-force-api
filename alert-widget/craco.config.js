var path = require('path');
var dotenv = require('dotenv');
var fs = require('fs');

module.exports = {
  webpack: {
    configure: function (config) {
      dotenv.config();

      fs.writeFileSync(
        './public/version.json',
        JSON.stringify({
          version: process.env.REACT_APP_VERSION,
        }),
        'utf-8',
      );

      return config;
    },
    alias: {
      '@common': path.resolve(__dirname, 'src/common'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
};
