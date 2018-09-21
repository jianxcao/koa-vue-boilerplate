module.exports = function (app) {
	const exports = {};
	exports.log = {
		logCfg: {
			disableClustering: true,
			categories: {
				'default': { appenders: ['console'], level: 'TRACE' },
				app: { appenders: ['console'], level: 'TRACE' },
				http: { appenders: ['console'], level: 'TRACE' }
			},
			pm2: false
		}
	};
	exports.view = {
		cache: false
	};
	return exports;
};
