const path = require('path');
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    // expose jquery as global symbols
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
    ]
  }
}