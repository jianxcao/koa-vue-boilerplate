const easywebpack = require('easywebpack-vue');
const path = require('path');
const baseWebpackConfig = require('./webpack.base');

const appPath = path.resolve(__dirname, '../');
const merge = easywebpack.merge;
module.exports = merge(baseWebpackConfig, {
	type: 'client',
	buildPath: path.resolve(appPath, 'public'),
	publicPath: 'public',
	devtool: 'eval-source-map'
});
