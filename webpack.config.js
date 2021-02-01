const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const MODE = process.env.NODE_ENV || PRODUCTION;
const IS_PRODUCTION = MODE === PRODUCTION;
const IS_DEVELOPMENT = MODE === DEVELOPMENT;


const distFolderName = 'dist' + ((IS_DEVELOPMENT) ? '-dev' : '') + '/';
const outputPath = path.resolve(__dirname, 'public/' + distFolderName);

module.exports = {
	devtool: (IS_DEVELOPMENT) ? 'inline-source-map' : undefined,
	mode: MODE,
	watch: IS_DEVELOPMENT,
	entry: {
		index: './src/index.jsx',
		login: './src/login.jsx'
	},
	output: {
		path: outputPath,
		publicPath: '../' + distFolderName
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: [
						'@babel/preset-env',
						['@babel/preset-react', { runtime: 'automatic' }]
					],
					plugins: [
						'@babel/plugin-proposal-class-properties'
					],
					comments: IS_DEVELOPMENT
				}
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					{ loader: 'css-loader', options: { sourceMap: true, import: false } },
					// Compiles Sass to CSS
					'resolve-url-loader',
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]
			},
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					},
				},
			},
			
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.css'
		})
	]
};
