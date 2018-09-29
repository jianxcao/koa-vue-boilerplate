// watch模式编译-- 只支持development模式
const server = require('./server');
const client = require('./client');
const EasyWebpack = require('easywebpack-vue');
const path = require('path');
const cluster = require('cluster');
const chokidar = require('chokidar');
const { getIp } = require('./utils');
const webpack = require('webpack');
const Koa = require('koa');
const proxy = require('koa-proxy');
const cors = require('kcors');
const chalk = require('chalk');
const devMiddleware = require('./dev-middleware');
const hotMiddleware = require('./hot-middleware');
const constant = require('../app/constant');
const { notifyStats } = require('./utils');

const merge = EasyWebpack.merge;
const extend = {
	env: 'dev',
	performance: {
		maxAssetSize: 2000000,
		maxEntrypointSize: 2000000
	},
};
// 主进程中的编译，调用 webpack-tool去编译
function compile() {
	const configItems = [
		EasyWebpack.getWebWebpackConfig(merge(client, extend)),
		EasyWebpack.getNodeWebpackConfig(merge(server, extend))
	];
	const res = configItems.map((webpackCfg, index) => new Promise((res, rej) => {
		const compiler = webpack(webpackCfg);
		const serverConfig = {
			hot: webpackCfg.target !== 'node',
			port: 9000 + index,
			target: webpackCfg.target,
			buildPath: webpackCfg.output.path,
			publicPath: webpackCfg.output.publicPath,
		};
		createWebpackServer(compiler, serverConfig);
		compiler.hooks.done.tap('webpack-build-done', stats => {
			res(compiler);
			notifyStats(stats);
		});
	}));
	return Promise.all(res);
}

function createWebpackServer(compiler, config, webpackConfigItem = {}) {
	const target = config.target;
	const port = config.port;
	const hot = config.hot;
	const publicPath = config.publicPath;
	const proxyInfo = config.proxy;
	const app = new Koa();
	app.use(cors());
	if (typeof proxyInfo === 'object') {
		// 支持多个域名代理
		const proxyList = Array.isArray(proxyInfo) ? proxyInfo : [proxyInfo];
		proxyList.forEach(item => {
			app.use(proxy(merge({
				jar: true,
				yieldNext: true,
			}, item)));
		});
	}
	if (compiler) {
		const devOptions = merge({
			publicPath,
			stats: {
				colors: true,
				children: true,
				modules: false,
				chunks: false,
				chunkModules: false,
				entrypoints: false,
			},
			headers: {
				'cache-control': 'max-age=0',
			},
			watchOptions: {
				ignored: /node_modules/,
			}
		}, { stats: webpackConfigItem.stats, watchOptions: webpackConfigItem.watchOptions });

		app.use(devMiddleware(compiler, devOptions));
		if (hot === undefined || hot) {
			app.use(hotMiddleware(compiler, {
				reload: true
			}));
		}
	}
	app.on('error', error => {
		console.error('server error:', error);
	});
	app.listen(port, err => {
		if (!err && compiler) {
			const ip = getIp();
			const url = `http://${ip}:${port}`;
			if (target) {
				console.info(chalk.green(`\r\n start webpack ${target} building server: ${url}`));
			} else {
				console.info(chalk.green(`\r\n start webpack building server: ${url}`));
			}
		}
	});
}
function readMemFile(compilers = [], fileName) {
	let content = '';
	for (const compiler of compilers) {
		try {
			const publicPath = compiler.options.output.publicPath;
			fileName = fileName.replace(publicPath, '');
			const name = path.isAbsolute(fileName) ? fileName : path.join(compiler.outputPath, fileName);
			content = compiler.outputFileSystem.readFileSync(name).toString();
			if (content) {
				return content;
			}
		} catch (e) {
			// console.error('read file error', e);
			content = '';
		}
	}
	return content;
}
// 主入口
async function main() {
	try {
		// 主进程的编译，并调用子进程启动服务
		const compilers = await compile();
		// 监听消息，如果Worker需要文件，则给worker文件
		cluster.on('message', (worker, msg) => {
			console.log('**** recevice msg', msg);
			switch (msg.action) {
			case constant.EVENT_WEBPACK_FILE_READ: {
				const res = readMemFile(compilers, msg.fileName);
				console.log('cluster send file:', res.length);
				worker.send({
					action: constant.EVENT_WEBPACK_MESSAGE_FILE,
					content: res,
					fileName: msg.fileName
				});
			}
				break;
			default:
			}
		});
		let worker = cluster.fork();
		// 文件发送变化杀死重启子进程
		chokidar.watch(path.resolve(__dirname, '../app'), {
			ignored: /app\/(web|view)/
		}).on('change', path => {
			console.info(`${path} changed`);
			worker.kill();
			worker = cluster.fork().on('listening', address => {
				console.info(`[master] listening: worker ${worker.id},
				pid:${worker.process.pid} ,Address:${address.address} :${address.port}`);
			});
		});
	} catch (e) {
		console.error(e);
	}
}

if (cluster.isMaster) {
	main();
} else {
	const app = require('../app/index'); // eslint-disable-line
}
