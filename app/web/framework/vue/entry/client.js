import Vue from 'vue';
import '../filter';
import '../directive';
import '../component';
import '../plugin';

export default function(options) {
	Vue.prototype.$request = require('axios'); // eslint-disable-line
	if (options.store) {
		options.store.replaceState(Object.assign({}, window.__INITIAL_STATE__, options.store.state));
	} else if (window.__INITIAL_STATE__) {
		options.data = Object.assign(window.__INITIAL_STATE__, options.data && options.data());
	}
	const app = new Vue(options);
	app.$mount('#app');
}
