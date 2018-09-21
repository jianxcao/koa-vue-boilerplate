const path = require('path');
const notifier = require('node-notifier');
const os = require('os');

exports.notifyStats = function notifyStats(stats) {
	let notifyOptions;

	const statsInfo = stats.toJson();

	if (stats.hasErrors()) {
		notifyOptions = {
			title: '编译失败！！！',
			message: `共有 ${statsInfo.errors.length} 个错误信息，请自行查看日志`,
			sound: true,
			timeout: 5,
			icon: path.resolve(__dirname, 'notify-images/error.png'),
		};
	} else {
		const warnMessage = stats.hasWarnings() ? `共有 ${statsInfo.warnings.length} 个警告信息，` : '';

		notifyOptions = {
			title: '编译成功',
			timeout: 2,
			message: `${warnMessage}请自行查看日志`,
			icon: path.resolve(__dirname, 'notify-images/success.png'),
		};
	}

	notifier.notify(notifyOptions);
};

exports.printStats = function printStats(stats) {
	const env = process.env.NODE_ENV;
	const hasErrors = stats.hasErrors();
	const hasWarnings = stats.hasWarnings();
	// 打印编译结果
	if (hasErrors || hasWarnings || env === 'production') {
		console[hasErrors ? 'error' : 'log'](stats.toString({ // eslint-disable-line
			chunks: false,
			colors: true
		}));
	}
};

exports.getIp = position => {
	const interfaces = os.networkInterfaces();
	const ips = [];

	if (interfaces.en0) {
		for (let i = 0; i < interfaces.en0.length; i++) {
			if (interfaces.en0[i].family === 'IPv4') {
				ips.push(interfaces.en0[i].address);
			}
		}
	}
	if (interfaces.en1) {
		for (let i = 0; i < interfaces.en1.length; i++) {
			if (interfaces.en1[i].family === 'IPv4') {
				ips.push(interfaces.en1[i].address);
			}
		}
	}
	if (position > 0 && position <= ips.length) {
		return ips[position - 1];
	} else if (ips.length) {
		return ips[0];
	}
	return '127.0.0.1';
};
