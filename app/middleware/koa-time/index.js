const log = require('koa-log4').getLogger('app');

module.exports = async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	log.info(`${process.pid} ${ctx.method} - ${ctx.url} - ${ms}ms`);
};
