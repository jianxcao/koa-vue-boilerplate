// 入口文件

const App = require('./app');
// 必须在这里，app中会初始化logger，所以要放在前面
const app = new App();
const path = require('path');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const convert = require('koa-convert');
const favicon = require('koa-favicon');
const cors = require('koa-cors');
const onerror = require('koa-onerror');
const resource = require('koa-static');
const log4js = require('koa-log4');
const CSRF = require('koa-csrf');
const timeAnalyze = require('./middleware/koa-time/index');
const router = require('./routers');
const koaView = require('./middleware/koa-view');
const vueView = require('./middleware/koa-vue-view');
const dev = require('./dev');

// 初始化日志模块
const log = log4js.getLogger('app');

// add body parsing
app.use(bodyParser());

// 配置session
app.keys = ['aaaaa', 'bbbbbb'];
app.use(convert(session()));

// csrf漏洞防范，cxt.csrf字段表示csrf的字段，如果改字段没有请求将会被拦截
app.use(new CSRF({
	invalidSessionSecretMessage: 'Invalid session secret',
	invalidSessionSecretStatusCode: 403,
	invalidTokenMessage: 'Invalid CSRF token',
	invalidTokenStatusCode: 403,
	excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
	disableQuery: false
}));
app.use(helmet());

app.use(koaView(app));
app.use(vueView(app));

dev(app);
// 配置可以跨域的请求
app.use(convert(cors()));

// 静态资源目录指定
app.use(resource(path.join(__dirname, '../')));

// app.proxy = true;

// favicon(__dirname + '/public/favicon.ico')
app.use(favicon());

app.use(timeAnalyze);

app
  .use(router.routes())
  .use(router.allowedMethods());

onerror(app);

app.on('error', error => {
	log.error('server error:' + error);
});

process.on('uncatchException', e => {
	log.fatal(e);
	log4js.shutdown(() => { process.exit(1); });
});

const server = require('http').createServer(app.callback());

server.listen(7002, () => {
	log.info('server start up' + server.address().port);
});

process.on('SIGINT', () => {
	server.close(err => {
		if (err) {
			log.error(err);
			log4js.shutdown(() => { process.exit(1); });
		}
	});
});
