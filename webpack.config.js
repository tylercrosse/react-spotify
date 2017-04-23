const path                    = require('path');
const webpack                 = require('webpack');
const CleanPlugin             = require('clean-webpack-plugin');
const ExtractTextPlugin       = require('extract-text-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// const BundleAnalyzer          = require('webpack-bundle-analyzer');

// const { BundleAnalyzerPlugin } = BundleAnalyzer;
const isProd = (process.env.NODE_ENV === 'production');
const entryPath = path.join(__dirname, './src/client/');
const vendors = [
  'd3',
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk',
  // 'reselect',
];
const sharedSassLoaders = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: {
      plugins() {
        return [
          require('autoprefixer')({
            add: true,
            remove: true,
            browsers: ['last 2 versions']
          })
        ];
      }
    }
  },
  // { loader: 'resolve-url-loader' }, // @fontface
  {
    loader: 'sass-loader',
    options: {sourceMap: true}
  }
];
// ------------------------------------
// Base Config
// ------------------------------------
const webpackConfig = {
  entry: {
    vendor: vendors
  },
  output: {
    path: path.resolve(__dirname, 'public/'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new CleanPlugin([
      'public/js',
      'public/css'
    ], {verbose: true}),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [path.resolve(__dirname, './src')],
        query: {
          presets: ['react-hmre']
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'file-loader'
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }
    ]
  }
};
// ------------------------------------
// Env Specfic config
// ------------------------------------
if (isProd) {
  webpackConfig.devtool = 'cheap-module-source-map';
  webpackConfig.entry.app = [
    entryPath
  ];
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ExtractTextPlugin({
      filename: 'css/style.min.css',
      allChunks: true
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'gitter-clone',
        filename: 'js/serviceWorker.js',
        // maximumFileSizeToCacheInBytes: 4194304,
        // minify: true,
        staticFileGlobs: [
          'public/img/**.*',
          'public/font/**.*',
        ],
        mergeStaticsConfig: true,
        // stripPrefix: 'public/',
      }
    )
    // new BundleAnalyzerPlugin()
  );
  webpackConfig.module.loaders.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          ...sharedSassLoaders
        ]
      }),
    },
    {
      test: /\.(js|jsx)?$/,
      use: 'babel-loader',
      include: [path.resolve(__dirname, './src')]
    }
  );
} else {
  // not production (dev)
  webpackConfig.devtool = 'source-map';
  webpackConfig.entry.app = [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    entryPath
  ];
  webpackConfig.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  );
  webpackConfig.module.loaders.push(
    {
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' },
        ...sharedSassLoaders
      ]
    }
  );
}

module.exports = webpackConfig;
