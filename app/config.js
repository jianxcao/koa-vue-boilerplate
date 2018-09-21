const deepmerge = require('deepmerge');

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;
const path = require('path');

const dev = ['config.default', 'config.local'];
const prod = ['config.default', 'config.prod'];
const env = process.env.NODE_ENV;
const configDir = '../config';
const file = env === 'production' ? prod : dev;
module.exports = function (app) {
	return file.reduce((all, current) => {
		const mod = require(path.join(configDir, current));// eslint-disable-line
		const cfg = typeof mod === 'function' ? mod(app) : mod;
		return deepmerge(all, cfg, {
			arrayMerge: overwriteMerge
		});
	}, {});
};
