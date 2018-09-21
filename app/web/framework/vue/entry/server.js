import Vue from 'vue';
import '../filter';
import '../directive';
import '../component';

// render返回一个方法，在 vue-view中被调用
export default function render(options) {
	if (options.store && options.router) {
		return context => {
			options.router.push(context.state.url);
			const matchedComponents = options.router.getMatchedComponents();
			if (!matchedComponents) {
				// 到koa中间件中去解决404
				return Promise.reject({
					code: '404'
				});
			}
			return Promise.all(
				matchedComponents.map(component => {
					if (component.preFetch) {
						return component.preFetch(options.store);
					}
					return null;
				})
			).then(() => {
				context.state = Object.assign(options.store.state, context.state);
				const opts = {
					...options
				};
				return new Vue(opts);
			});
		};
	}
	return context => {
		const VueApp = Vue.extend(options);
		const app = new VueApp({
			data: context.state
		});
		return new Promise(resolve => {
			resolve(app);
		});
	};
}
