module.exports = {
  entry: './src/js/main.js',
  output: {
    path: './build/asset/js',
    filename: 'main.js'
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
