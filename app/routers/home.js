const Router = require('koa-router');
const logger = require('koa-log4').getLogger('app');
// 可以调用service直接去获取数据
// 可以调用模板去解析页面
const router = new Router();

router.get(['/', '/home'], async ctx => {
	await ctx.render('home/home.js', {
		test: '1233',
		title: 'koa-vue-webpack-home',
		keywords: 'koa vue webpack',
		description: 'koa-vue-webpack'
	});
	logger.debug(ctx.csrf);
});
module.exports = router;
