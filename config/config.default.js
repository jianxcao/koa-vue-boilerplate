const path = require('path');

const appDir = path.resolve(__dirname, '../');
const logDir = path.join(appDir, 'logs');
const logCfg = require('./log.json');

module.exports = function (app) {
	const exports = {};

	exports.log = {
		logDir,
		logCfg
	};

	// 模板配置
	exports.view = {
		root: path.join(app.baseDir, 'app/view'),
		// 文件将会被读取到内存，不在从磁盘读取
		cache: false,
		defaultExtension: '.html',
		defaultViewEngine: '',
		mapping: {
			'.js': 'vue'
		},
	};

	/**
   * vue ssr config
   * @member Config#vue
   * @property {String} [doctype] - html doctype
   * @property {String} [layout=${baseDir}/app/view/layout.html] - client render template, support renderString compile
   * @property {String} [manifest=${baseDir}/config/manifest.json] - resource dependence(css, js) config
   * @property {Boolean} [injectCss] whether inject href css
   * @property {Boolean} [injectJs] whether inject src script
   * @property {Array} [injectRes] inline/inject css or js to file head or body. include location and src config
   *           inline {Boolean} true or false, default false
   *           location {String} headBefore, headAfter, bodyBefore, bodyAfter  insert location, default headBefore
   *           url {String} inline file absolution path
   * @property {Boolean} [mergeLocals] whether merge ctx locals, default true
   * @property {Boolean|String} [crossorigin] js cross domain support for cdn js error catch, default false
   * @property {Object} [cache] lru-cache options @see https://www.npmjs.com/package/lru-cache
   * @property {Object} [renderOptions] @see https://ssr.vuejs.org/en/api.html#renderer-options
   * renderOptions.template will override layout template
   * @property {Function} afterRender hook html after render
   * `publicPath`: static resource prefix path, so cdn domain address prefix or local prefix path(`/`)
   * `commonsChunk`: common js or css filename, so `vendor`
   */
	exports.vuessr = {
		doctype: '<!doctype html>',
		// renderToClient时候用
		layout: path.join(app.baseDir, 'app/web/view/layout.html'),
		// 根据mainfest注入资源- 在编译的时候需将配置文件生成到这个目录
		manifest: path.join(app.baseDir, 'config/manifest.json'),
		injectHeadRegex: /(<\/head>)/i,
		injectBodyRegex: /(<\/body>)/i,
		injectCss: true,
		injectJs: true,
		injectRes: [],
		crossorigin: false,
		mergeLocals: true,
		fallbackToClient: true, // fallback to client rendering if server render failed,
		cache: {
			max: 1000,
			maxAge: 1000 * 3600 * 24 * 7,
		},
		renderOptions: {
			runInNewContext: 'once',
      // template: `<!DOCTYPE html><html lang="en"><body><!--vue-ssr-outlet--></body></html>`,
		},
		afterRender: (html, context) =>  /* eslint no-unused-vars:off */
       html,
	};
	return exports;
};
