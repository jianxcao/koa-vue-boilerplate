<template>
  <header class="header">
    <div class="container">
      <h1><a href="/" class="router-link-active">Egg + Vue</a></h1>
      <ul class="nav">
        <li class="nav-item"><a href="/" :class="{'active' : selectedMenu === '/'}">server home</a></li>
				<li class="nav-item"><a href="/test" :class="{'active' : selectedMenu === '/'}">client test</a></li>
      </ul>
    </div>
  </header>
</template>
<style lang="less">
@import "./header.less";
</style>
<script type="text/babel">
export default {
	data () {
		return {
			selectedMenu: '/'
		};
	},
	computed: {},
	mounted () {
		this.selectedMenu = window.location.pathname.toLowerCase();
	}
};
</script>
