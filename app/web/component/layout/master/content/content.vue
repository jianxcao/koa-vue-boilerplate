<template>
  <div class="main">
    <div class="page-container page-component">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<style>
@import "content.less";
</style>
<script type="text/babel">
export default {
	name: 'v-content',
	data () {
		return {

		};
	},
	components: {},
	mounted () {

	}
};
</script>
