module.exports = function (app) {
	const exports = {};
	exports.log = {
		logCfg: {
			pm2: true
		}
	};
	// 线上环境开启缓存
	exports.view = {
		cache: false
	};
	return exports;
};
