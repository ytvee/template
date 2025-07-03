<template>
  <div class="decorated-div" :style="{ 'border-radius': borderRadius }">
    <div class="border-holder">
      <slot name="border-svg"></slot>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script>
/*

Usage:
Put in border-svg slot svg with rect wich have gradient slot rx ry of rect set as doubled border-radius
repeat rx and ry value in borderRadius prop and stroke-width in borderWidth prop in order to properly adjust container style properly.
borderRadius borderWidth
*/
export default {
  name: "DecoratedDiv",
  props: {
    borderRadius: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.decorated-div {
  position: relative;
  overflow: hidden;
}
.border-holder {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.border-holder:deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
