const Router = require('koa-router');
// 可以调用service直接去获取数据
// 可以调用模板去解析页面
const router = new Router();

router.get(['/', '/about'], async ctx => {
	// ctx.body = 'ok';
	// ctx.status = 200;
	await ctx.render('about/about.js', {
		test: '123'
	});
});
module.exports = router;
