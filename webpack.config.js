const mock = require('./mock/server')
const path = require('path');

const PUBLIC_FOLDER = 'public'
const OUTPUT_FOLDER = 'dist'
const OUTPUT_JS_FILE = 'bundle.js'
const NODE_ENV = process.env.NODE_ENV

module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: OUTPUT_JS_FILE,
		path: path.resolve(__dirname, OUTPUT_FOLDER),
	},
	mode: NODE_ENV ? NODE_ENV : 'development',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	devServer: {
		after: mock.after,
		before: mock.before,
		contentBase: path.resolve(__dirname, PUBLIC_FOLDER),
		host: "0.0.0.0"
	}
};
