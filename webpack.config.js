module.exports = {
  entry: {
    main: './src/js/main.js',
    options: './src/js/options.js'
  },
  output: {
    path: './build/asset/js',
    filename: '[name].js'
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
