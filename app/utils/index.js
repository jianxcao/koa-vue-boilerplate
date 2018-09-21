const debug = require('debug')('app');
/**
 * 拷贝一个对象上的symbols和自身的字段到另外一个object
 */
exports.copyProp = function (origin = {}, ext = {}) {
	const properties = Object.getOwnPropertyNames(ext)
	.concat(Object.getOwnPropertySymbols(ext));
	for (const property of properties) {
		const descriptor = Object.getOwnPropertyDescriptor(ext, property);
		if (Object.hasOwnProperty.call(debug, property)) {
			debug('origin already exists %s', property);
		}
		Object.defineProperty(origin, property, descriptor);
	}
};
