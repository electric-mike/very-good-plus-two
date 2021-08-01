/* eslint-disable */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminOptipng = require('imagemin-optipng')
const imageminSvgo = require('imagemin-svgo')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const WebpackBar = require('webpackbar');
// uncomment for bundle stats
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = (env, argv) => ({
  context: path.join(__dirname, 'src'),
  entry: {
    application: './js/index.js',
    grid: './scss/grid.scss',
    elements: './scss/elements.scss',
    helpers: './scss/helpers.scss',
    global: './scss/global.scss',
    header: './scss/header.scss',
    navigation: ['./js/navigation.js', './scss/navigation.scss'],
    footer: './scss/footer.scss',
    homepage: './scss/homepage.scss',
    collection: ['./js/collection.js', './scss/collection.scss'],
    cms: ['./js/cms.js', './scss/cms.scss'],
    product: ['./js/product.js', './scss/product.scss'],
    cart: ['./js/cart.js', './scss/cart.scss'],
    blog: ['./js/blog.js', './scss/blog.scss'],
    account: ['./js/account.js', './scss/account.scss'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets'),
  },
  stats: {
    warnings: false,
    children: false,
    modules: false,
    entrypoints: false
  },
  optimization: {
    namedChunks: true,
    removeAvailableModules: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
        },
        assets: {
          test: /assets/,
          chunks: 'initial',
          name: 'assets',
          enforce: true,
        },
        styles: {
          name: 'styles',
          test: /\.s?css$/,
          minChunks: 1,
          enforce: true,
        },
      },
    },
    runtimeChunk: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /\/excludes/,
      }),
    ],
  },
  module: {
    rules: [{
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          failOnError: argv.mode === 'production',
        },
      },
      {
        test: /\.pug$/,
        oneOf: [{
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'],
          },
          {
            use: ['raw-loader', 'pug-plain-loader'],
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          sourceMap: argv.mode === 'production',
          presets: [['@babel/preset-env']],
          plugins: ["@babel/plugin-transform-runtime"]
        },
      },
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\_variables.scss$/,
        loader: 'sass-extract-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, 'assets'),
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: argv.mode === 'production',
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: argv.mode === 'production',
            },
          },
        ],
      },
      {
        test: /\.(html|html)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'url-loader',
        ],
      },
      {
        test: /\.ico$/i,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app'),
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      Src: path.join(__dirname, 'src'),
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  plugins: [
    new WebpackBar(),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: argv.mode === 'production' ? 'static' : 'server',
    // }),
    new StylelintPlugin({
      configFile: './.stylelintrc',
      files: ['**/*.{vue,html,css,scss}'],
      fix: true
    }),
    new VueLoaderPlugin(),
    new ImageminPlugin({
      bail: false,
      cache: true,
      imageminOptions: {
        // Lossless optimization with custom option
        plugins: [
          imageminGifsicle({
            interlaced: true,
          }),
          imageminJpegtran({
            progressive: true,
          }),
          imageminOptipng({
            optimizationLevel: 5,
          }),
          imageminSvgo({
            removeViewBox: true,
          }),
        ],
      },
    }),
    new FixStyleOnlyEntriesPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new OptimizeCssAssetsPlugin({}),
  ],
})
