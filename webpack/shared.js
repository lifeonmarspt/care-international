const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootPath = process.cwd();

const config = {

  target: 'web',

  entry: [
    path.join(rootPath, 'src/main.jsx')
  ],

  output: {
    path: path.join(rootPath, 'dist/'),
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules|lib)/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: process.env.NODE_ENV === 'production'
          }
        }],
        include: [
          path.resolve(rootPath, 'src')
        ]
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: [
          path.resolve(rootPath, 'src')
        ]
      }, {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', {
              loader: 'sass-loader',
              options: {
                includePaths: [
                ]
              }
            },
            'postcss-loader'
          ]
        }),
        include: [
          path.resolve(rootPath, 'src')
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(rootPath, 'src'),
      path.join(rootPath, 'node_modules')
    ],
    unsafeCache: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html'
    })
  ]

};

module.exports = config;
