const path = require('path');
const Constant = require('./constant');
const mime = require('mime');

const exts = ['js', 'css', 'woff', 'ttf', 'svg', 'gif', 'png', 'jpg', 'webbp', 'json'];
const env = process.env.NODE_ENV;
const readFile = fileName => new Promise((resolve, reject) => {
	process.send({ action: Constant.EVENT_WEBPACK_FILE_READ, fileName });
	const handleMsg = msg => {
		// 收到消息，并且该消息的文件是当前需要的文件
		if (msg && msg.action === Constant.EVENT_WEBPACK_MESSAGE_FILE && msg.fileName === fileName) {
			resolve(msg.content);
			process.off('message', handleMsg);
		}
	};
	process.on('message', handleMsg);
	// 超过5s拿不出数据，认为没拿到
	setTimeout(() => {
		resolve('');
		process.off('message', handleMsg);
	}, 5000);
});
// 只有在dev环境下需要处理的东西
module.exports = app => {
	const logger = app.logger;
	const hot = process.env.HOT;
	if (env === 'development' && hot) {
		// 强制修改模板引擎不缓存模板
		app.vue.bundleCache = false;
		// 覆盖view中查找模板的方法
		app.view.resolve = function (name) {
			return Promise.resolve(name);
		};
		const render = app.vue.render.bind(app.vue);
		// 覆盖 render去内存中读取
		app.vue.render = async (name, context, options) => {
			const filePath = path.isAbsolute(name) ? name : path.join(app.config.view.root[0], name);
			const content = await readFile(filePath);
			logger.debug('read vue template file %s', filePath);
			return render(content, context, options);
		};
		app.use(async (ctx, next) => {
			const ext = path.extname(ctx.url).replace(/^\./, '');
			if (ext && exts.find(cur => cur === ext)) {
				logger.debug('read webpack memory file: %s', ctx.url);
				const content = await readFile(ctx.url);
				const mimeType = ext ? mime.getType(ctx.url) : 'text/html';
				ctx.set('content-type', mimeType);
				if (content) {
					ctx.body = content;
					ctx.status = 200;
					return;
				}
			}
			await next();
		});
	}
};
