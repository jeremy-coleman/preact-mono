const { resolve } = require('path');
var path = require('path')
const webpack = require('webpack');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const TsPathPlugin = require('tsconfig-paths-webpack-plugin')
const watch = process.env.NODE_ENV === 'development';
const outputPath = resolve(__dirname, '_www', 'demo');

const DOM_RENDERER = process.env.NODE_ENV === 'production' ? 'preact/compat' : '@hot-loader/react-dom'

module.exports = {
  //entry: ['@babel/polyfill', './src/index.js', 'webpack-plugin-serve/client'],
  //context: __dirname,
  mode: process.env.NODE_ENV,
  stats:"minimal",
  devtool: 'inline-source-map',
	node: {
		process: 'mock',
		Buffer: false,
		setImmediate: false
	},
  //context: __dirname,
  entry: ['./packages/demos/new-features/index.jsx', 'webpack-plugin-serve/client'],
  output: {
    path: outputPath,
    publicPath: '/',
    filename: 'client.js'
  },
	resolve: {
    extensions: ['.jsx', '.js', '.json', '.mjs', '.ts', '.tsx'],
		alias: {
			["preact/debug"]: path.join(__dirname, 'packages', 'preact', 'debug'),
      ["preact/hooks"]: path.join(__dirname, 'packages', 'preact', 'hooks'),
      //["preact/compat"]: path.join(__dirname, 'packages', 'preact', 'compat'),
			preact: path.join(__dirname, 'packages', 'preact'),
			react: path.join(__dirname, 'packages', 'preact', 'compat'),
      'react-dom': path.join(__dirname, 'packages', 'preact', 'compat')
      // react: 'preact/compat',
			// 'react-dom': 'preact/compat'
    },
    plugins:[
      new TsPathPlugin()
    ]
	},
  module: {
    rules: [
      {
				test: /\.[tj]sx?$/,
        use:[
          //'react-hot-loader/webpack',
          {loader: 'ts-loader', options: {transpileOnly: true}}
        ],
        exclude: /node_modules/,
			},


      {test: /\.s?css$/,use: ['style-loader','css-loader','sass-loader']},
      {
        test: /\.woff(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/font-woff2'
          }
        }
      },
      {
        test: /\.(otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.svg(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]',
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.(png|jpg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({template: "packages/demos/new-features/index.html"}),
    //new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)}}),
    //new webpack.NamedModulesPlugin(),
    new Serve({
      // note: this value is true by default
      hmr: true,
      host: "localhost",
      progress: false,
      historyFallback: true,
      static: [outputPath]
    })
  ],
  //   optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendor',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },

  watch
};


	

// {
//   test: /\.[tj]sx?$/,
//   use:[
//     //'react-hot-loader/webpack',
//     {loader: 'babel-loader', options: {
//       plugins: [
//         (process.env.NODE_ENV === 'production' && require.resolve('babel-plugin-transform-react-remove-prop-types')),
//         "react-hot-loader/babel",
//         //[require.resolve('fast-async'), { spec: true }],
//         //require.resolve('babel-plugin-macros'),
//       ].filter(Boolean)
//   }},
//     {loader: 'ts-loader', options: {transpileOnly: true}}
//   ],
//   exclude: /node_modules/,
// },
// {
//   test: /\.([tj]sx?)$/,
//   exclude: /node_modules/,
//   use: [
//     {loader: 'react-hot-loader/webpack'},
//     {loader: 'babel-loader', options: {
//       plugins: [
//       require.resolve('@babel/plugin-transform-typescript', {isTsx: true, pragma: 'h', pragmaFrag: 'Fragment'}),
//       require.resolve('@babel/plugin-syntax-dynamic-import'),
//       require.resolve('@babel/plugin-transform-object-assign'),
//       [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
//       require.resolve('@babel/plugin-proposal-class-properties'),
//       require.resolve('@babel/plugin-proposal-object-rest-spread'),
//       require.resolve('@babel/plugin-transform-react-constant-elements'),
//       //isProd && require.resolve('babel-plugin-transform-react-remove-prop-types'),
//       [
//         require.resolve('@babel/plugin-transform-react-jsx'),
//         { pragma: 'h', pragmaFrag: 'Fragment' },
//       ],
//       [require.resolve('fast-async'), { spec: true }],
//       require.resolve('babel-plugin-macros'),

//       require.resolve('react-hot-loader/babel'),
//     ]
//     }}]
// },
// const hotLoader = interopDefault(require('react-hot-loader'));
// hotLoader.preact(interopDefault(require('preact')));


				// options: {
				// 	sourceMap: true,
				// 	presets: [
				// 		[require.resolve('@babel/preset-env'), {
				// 			targets: {
				// 				browsers: ['last 2 versions', 'IE >= 9']
				// 			},
				// 			modules: false,
				// 			loose: true
				// 		}],
				// 		require.resolve('@babel/preset-react'),
				// 	],
				// 	plugins: [
				// 		[require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'createElement', pragmaFrag: 'Fragment' }],
				// 		require.resolve('@babel/plugin-proposal-class-properties'),
				// 		require.resolve('@babel/plugin-transform-react-constant-elements'),
				// 		// [require.resolve('babel-plugin-jsx-pragmatic'), {
				// 		// 	module: 'preact',
				// 		// 	export: 'createElement',
				// 		// 	import: 'createElement'
				// 		// }]
				// 	]
				// }