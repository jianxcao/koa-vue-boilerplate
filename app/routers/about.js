const Router = require('koa-router');
// 可以调用service直接去获取数据
// 可以调用模板去解析页面
const router = new Router();

router.get(['/about'], async ctx => {
	await ctx.renderClient('about/about.js', {
		title: 'koa-vue-webpack-about',
		keywords: 'koa vue webpack',
		description: 'koa-vue-webpack'
	});
});
module.exports = router;
