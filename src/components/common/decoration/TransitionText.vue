<template>
  <div class="transition-text-gradient-accent">
    <!-- eslint-disable-next-line -->
    <span class="transition-text-gradient-accent-inner base" v-html="innerHtml"></span>
    <!-- eslint-disable-next-line -->
    <span class="transition-text-gradient-accent-inner overlay" v-html="innerHtml"></span>
  </div>
</template>

<script>
/**
 * How to use: set .transition-text-gradient-accent-parent class to ancestor which hover should influence on this text
 */
export default {
  name: "TransitionText",
  props: {
    innerHtml: {
      type: String,
      required: true,
    },
    fontSize: {
      type: String,
      required: true,
    },
  },
  computed: {
    getFontSizePx() {
      return this.$props.fontSize + "px";
    },
  },
};
</script>

<style>
.transition-text-gradient-accent {
  display: inline-block;
  font-size: v-bind("getFontSizePx");
  position: relative;
}

.transition-text-gradient-accent-inner.base {
  font-size: v-bind("getFontSizePx");

  /* todo: need to update variables */
  background: var(--sound-splitter-gradient-accent);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  opacity: 1;
  transition: opacity var(--default-transition);
}

.transition-text-gradient-accent-inner.overlay {
  font-size: v-bind("getFontSizePx");
  /* todo: need to update variables */
  color: var(--sound-splitter-color-grey-4);

  position: absolute;
  inset: 0;

  opacity: 0;
  transition: opacity var(--default-transition);
}

.transition-text-gradient-accent-parent:hover .transition-text-gradient-accent .transition-text-gradient-accent-inner.base {
  opacity: 0;
}
.transition-text-gradient-accent-parent:hover .transition-text-gradient-accent .transition-text-gradient-accent-inner.overlay {
  opacity: 1;
}
</style>
