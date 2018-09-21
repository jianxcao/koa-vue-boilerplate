const EasyWebpack = require('easywebpack-vue');
const path = require('path');
const baseWebpackConfig = require('./webpack.base');

const appPath = path.resolve(__dirname, '../');
const merge = EasyWebpack.merge;

module.exports = merge(baseWebpackConfig, {
	type: 'server',
	buildPath: path.resolve(appPath, 'app/view')
});
