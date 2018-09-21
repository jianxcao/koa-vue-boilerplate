
module.exports = {
	framework: 'vue',
	entry: {
		include: ['app/web/page'],
		exclude: ['app/web/page/[a-z]+/(component|store|common|page|pagelet|image|img|style|styles|css)'],
		loader: {
			client: 'app/web/framework/vue/entry/client-loader.js',
			server: 'app/web/framework/vue/entry/server-loader.js',
		}
	},
	alias: {
		common: 'app/web/common',
		server: 'app/web/framework/vue/entry/server.js',
		client: 'app/web/framework/vue/entry/client.js',
		asset: 'app/web/asset',
		component: 'app/web/component',
		framework: 'app/web/framework'
	},
	loaders: {},
	plugins: {
		serviceworker: false
	},
	node: {
		console: true
	},
	optimization: {},
	done() {
		console.log('如果启动成功后, Chrome控制台浏览器脚本报错, 可以尝试执行 npm run clean 清除缓存解决');
	}
};
