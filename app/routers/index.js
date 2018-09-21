const Router = require('koa-router');
const fs = require('fs');

const rootRooter = new Router();
const stats = fs.readdirSync(__dirname);
/* eslint-disable */
if (stats) {
	stats.forEach(fileName => {
		if (fileName === 'index.js') {
			return;
		}
		let router = require(`./${fileName}`);
		rootRooter.use(router.routes(), router.allowedMethods());
	});
}
/* eslint-enable */

module.exports = rootRooter;
