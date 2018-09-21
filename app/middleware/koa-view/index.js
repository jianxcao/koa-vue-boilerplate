const ContextView = require('../../middleware/koa-view/view');
const ViewManager = require('../../middleware/koa-view/viewManager');

const VIEW = Symbol('Context#view');
const VIEW_MANAGER = Symbol('Application#view');

const { copyProp } = require('../../utils');

const view = {

  /**
   * Render a file, then set to body, the parameter is same as {@link @ContextView#render}
   * @return {Promise} result
   */
	render(...args) {
		return this.renderView(...args)
		.then(body => {
			this.body = body;
			this.status = 200;
		});
	},

  /**
   * Render a file, same as {@link @ContextView#render}
   * @return {Promise} result
   */
	renderView(...args) {
		return this.view.render(...args);
	},

  /**
   * Render template string, same as {@link @ContextView#renderString}
   * @return {Promise} result
   */
	renderString(...args) {
		return this.view.renderString(...args);
	},

  /**
   * View instance that is created every request
   * @member {ContextView} Context#view
   */
	get view() {
		if (!this[VIEW]) {
			this[VIEW] = new ContextView(this);
		}
		return this[VIEW];
	},

};

const viewManager = {
  /**
   * Retrieve ViewManager instance
	 * 挂载到app上，被ContextView读取
   * @member {ViewManager} Application#view
   */
	get view() {
		if (!this[VIEW_MANAGER]) {
			this[VIEW_MANAGER] = new ViewManager(this);
		}
		return this[VIEW_MANAGER];
	},
};
// 像ctx中注入view
module.exports = function (app) {
	copyProp(app, viewManager);
	return async (ctx, next) => {
		// Object.assign(ctx.app, viewManager);
		copyProp(ctx, view);
		// Object.assign(ctx, view);
		await next();
	};
};
