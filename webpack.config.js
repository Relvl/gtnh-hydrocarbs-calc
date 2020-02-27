const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");

const path = require("path");
const _ = require("underscore");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const paths = {
	src: path.resolve(__dirname, "./"),
	docs: path.resolve(__dirname, "./docs/"),
};

module.exports = (env, argv) => {
	env = env || {};
	argv = argv || {};
	console.log("env", env);
	console.log("argv", argv);

	const __watch = (watch, another) => (argv.watch || argv.hot || argv.host ? watch : another);

	return [
		{
			name: "sources",
			watch: false,
			mode: "development",
			devtool: "source-map",
			entry: {
				application: _.flatten([
					glob.sync("./scss/component/**/*.scss"), //
					"./global.tsx", //
					"./init.tsx", //
					"./scss/application.scss", //
				]),
			},
			resolve: {
				extensions: [".ts", ".tsx", ".js", ".jsx"],
			},
			output: {
				path: paths.docs,
				filename: "[name].[hash:8].js",
				sourceMapFilename: "[name].[hash:8].map",
				chunkFilename: "[id].[hash:8].js",
			},
			optimization: {
				minimize: __watch(false, true),
				removeAvailableModules: __watch(false, true),
				removeEmptyChunks: __watch(false, true),
				minimizer: [
					new TerserWebpackPlugin({
						sourceMap: true,
						cache: __watch(true, false),
						terserOptions: {
							mangle: false,
						},
					}),
				],
			},

			devServer: {
				host: "localhost",
				port: 8443,
				https: true,
				hot: false,
				inline: false,
				stats: {
					colors: true,
					/*modules: true,
					chunks: false,
					chunkModules: false,
					children: false,*/
				},
			},

			module: {
				rules: [
					{
						test: /\.tsx?$/,
						loader: "awesome-typescript-loader",
					},
					{
						test: /\.scss$/,
						use: [MiniCssExtractPlugin.loader, {loader: "css-loader", options: {url: false, sourceMap: true}}, {loader: "sass-loader", options: {sourceMap: true}}],
					},
				],
			},
			plugins: [
				new CleanWebpackPlugin({
					verbose: true,
					cleanStaleWebpackAssets: false,
					cleanOnceBeforeBuildPatterns: [],
				}),
				new HtmlWebpackPlugin({
					title: "Цифровой маркетинг",
					template: "./index.html",
					favicon: "./favicon.ico",
				}),
				new MiniCssExtractPlugin({filename: "[name].[hash:8].css"}),
				new OptimizeCssAssetsPlugin({
					cssProcessorOptions: {map: {inline: false}},
					cssProcessorPluginOptions: {preset: ["default", {discardComments: {removeAll: true}}]},
				}),
				new CopyPlugin([{
					from: path.join(paths.src, "image/"),
					to: path.join(paths.docs, "image/"),
				}]),
			],
		},
	];
};
