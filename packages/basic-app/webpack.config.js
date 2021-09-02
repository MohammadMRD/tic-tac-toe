const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: __dirname + '/src/app/index.js',

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /(node_modules|bower_components)/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/public/index.html',
      inject: 'body',
    }),
  ],

  devServer: {
    port: 8080,
    hot: true,
    watchFiles: ['src/**/*'],
  },
}
