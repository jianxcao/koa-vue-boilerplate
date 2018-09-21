
const Engine = require('./engine');

const VUE_ENGINE = Symbol('Application#vue');
const { copyProp } = require('../../utils');

const vue = {
	get vue() {
		if (!this[VUE_ENGINE]) {
			this[VUE_ENGINE] = new Engine(this);
		}
		return this[VUE_ENGINE];
	},
};
// 扩展ctx扩展出以客户的渲染的方法
const ctxExt = {
	renderClient(name, locals, options) {
		return this.renderVueClient(name, locals, options);
	},
	renderVueClient(name, locals, options = {}) {
		locals = this.app.vue.normalizeLocals(this, locals, options, false);
		return this.app.vue.renderClient(name, locals, options).then(html => {
			this.body = html;
		});
	},
};

module.exports = function (app) {
	// 将vue的引擎注入app中
	copyProp(app, vue);
	app.view.use('vue', require('./view'));// eslint-disable-line
	return async function (ctx, next) {
		// 扩展ctx增加 以客户的方式渲染的方法
		copyProp(ctx, ctxExt);
		await next();
	};
};

