<template>
  <div>
    <LayoutHeader></LayoutHeader>
    <LayoutContent>
      <div slot="content">
        <slot name="main"></slot>
      </div>
    </LayoutContent>
		<LayoutFooter/>
  </div>
</template>
<script type="text/babel">
import LayoutHeader from './header/header';
import LayoutContent from './content/content';
import LayoutFooter from './footer/footer';

export default {
	components: {
		LayoutHeader,
		LayoutContent,
		LayoutFooter
	}
};
</script>
