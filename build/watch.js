// watch模式编译-- 只支持development模式
const server = require('./server');
const client = require('./client');
const EasyWebpack = require('easywebpack-vue');
const webpack = require('webpack');
const path = require('path');
const cluster = require('cluster');
const chokidar = require('chokidar');
const { printStats, notifyStats } = require('./utils');

const merge = EasyWebpack.merge;
const extend = {
	env: 'test',
	hash: false,
	watch: true,
	plugins: {
		hashModule: false
	},
	performance: {
		maxAssetSize: 2000000,
		maxEntrypointSize: 2000000
	},
};
// console.dir(merge(client, extend).plugins);
// console.log(EasyWebpack.getWebWebpackConfig(merge(client, extend)));
function compile() {
	const configItems = [
		EasyWebpack.getNodeWebpackConfig(merge(server, extend)),
		EasyWebpack.getWebWebpackConfig(merge(client, extend))
	];
	return new Promise((resove, reject) => {
		webpack(configItems, (err, stats) => {
			if (err) {
				reject(err);
				return;
			}

			// 打印编译结果
			printStats(stats);
			notifyStats(stats);
			if (stats.hasErrors()) {
				console.error('编译失败，请解决完错误之后再重试！');
			}
			resove();
		});
	});
}

async function main() {
	try {
		compile();
		let worker = cluster.fork();
		chokidar.watch(path.resolve(__dirname, '../app'), {
			ignored: /app\/(web|view)/
		}).on('change', path => {
			console.log(`${path} changed`);
			worker.kill();
			worker = cluster.fork().on('listening', address => {
				console.log(`[master] listening: worker ${worker.id}, pid:${worker.process.pid} ,Address:${address.address} :${address.port}`);
			});
		});
	} catch (e) {
		console.error(e);
	}
}

if (cluster.isMaster) {
	main();
} else {
	require('../app/index');
}
