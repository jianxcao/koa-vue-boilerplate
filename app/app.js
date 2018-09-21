const Koa = require('koa');
const co = require('co');
const is = require('is-type-of');
const appMix = require('./extend/applictation');
const ctxMix = require('./extend/context');
const log4js = require('koa-log4');
const helper = require('./extend/helper');

class App extends Koa {
	constructor () {
		super();
		// app 变量混入
		Object.assign(this, appMix);
		const config = require('./config')(this); // eslint-disable-line
		// 初始化日志模块
		log4js.configure(config.log.logCfg, config.log.logDir);
		const log = log4js.getLogger('app');
		this.config = config;
		this.logger = log;
		this.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }));
		// 注入app和log和配置变量, 混入全局的变量和方法
		this.use(async (ctx, next) => {
			ctx.logger = log;
			ctx.app = this;
			Object.assign(ctx, ctxMix);
			ctx.helper = helper;
			await next();
		});
	}
  /**
   * use co to wrap generator function to a function return promise
   * @param  {GeneratorFunction} fn input function
   * @return {AsyncFunction} async function return promise
   */
	toAsyncFunction(fn) {
		if (!is.generatorFunction(fn)) return fn;
		fn = co.wrap(fn);
		return async function(...args) {
			return fn.apply(this, args);
		};
	}

  /**
   * use co to wrap array or object to a promise
   * @param  {Mixed} obj input object
   * @return {Promise} promise
   */
	toPromise(obj) {
		return co(function * () {
			return yield obj;
		});
	}
}

module.exports = App;
