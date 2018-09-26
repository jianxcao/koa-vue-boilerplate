
import MainLayout from './main';

const content = '<div id="app"><MainLayout><div slot="main"><slot></slot></div></MainLayout></div>';

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{vTitle}}</title>
  <meta name="keywords" :content="vKeywords">
  <meta name="description" :content="vDescription">
  <meta http-equiv="content-type" content="text/html;charset=utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
</head>
<body :class="baseClass">
  <div id="app">${content}</div>
</body>
</html>`;

export default {
	name: 'Layout',
	props: ['title', 'description', 'keywords'],
	components: {
		MainLayout
	},
	computed: {
		vTitle() {
			return this.$root.title || this.title || ' ';
		},
		vKeywords() {
			return this.$root.keywords || this.keywords;
		},
		vDescription() {
			return this.$root.description || this.description;
		},
		baseClass() {
			return this.$root.baseClass;
		}
	},
	template: EASY_ENV_IS_NODE ? template : content // eslint-disable-line
};
