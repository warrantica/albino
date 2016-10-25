var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    './js/main.js': './src/js/main.js',
    './js/options.js': './src/js/options.js',
    './css/app.css': './src/css/app.scss'
  },
  output: {
    path: './build/asset',
    filename: '[name]'
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          // vue-loader options go here
        }
      },{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]')
  ],
  vue: {
    loaders: {
      js: 'babel',
      sass: 'style!css!sass?indentedSyntax',
      scss: 'style!css!sass'
    }
  }
}
