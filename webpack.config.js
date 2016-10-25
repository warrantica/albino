module.exports = {
  entry: {
    './js/main.js': './src/js/main.js',
    './js/options.js': './src/js/options.js'
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
      }
    ]
  },
  vue: {
    loaders: {
      js: 'babel',
      sass: 'style!css!sass?indentedSyntax',
      scss: 'style!css!sass'
    }
  }
}
