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
      '@implements': path.resolve(__dirname, 'src/implements'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
};
