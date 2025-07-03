<!-- eslint-disable vue/no-v-html -->
<template>
  <div ref="decoratedButton" class="decorated-button" :class="{ active: isActive }" tabindex="0" @keypress.enter="emitClickEvent">
    <div class="border-holder">
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <clipPath id="decorated-button-border-clip-mask">
            <rect width="100%" height="100%" fill="none" rx="5px" ry="5px" />
          </clipPath>
          <linearGradient id="decorated-button" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#74DE6F" />
            <stop offset="1" stop-color="#CDE768" />
            <!-- <stop offset="0" stop-color="#0000FF" /> -->
            <!-- <stop offset="1" stop-color="#FF0000"/> -->
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="none" stroke="url(#decorated-button)" stroke-width="4" clip-path="url(#decorated-button-border-clip-mask)" rx="5px" ry="5px" />
      </svg>
    </div>
    <div class="svg-holder" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "DecoratedButton",
  props: {
    content: {
      type: String,
      required: false,
      default: "",
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    emitClickEvent() {
      this.$refs.decoratedButton.click();
    },
  },
};
</script>

<style scoped>
.decorated-button {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: var(--small-border-radius);

  background: var(--gradient-primary-transparent);
  box-shadow: 0px 1px 6.699999809265137px 0px var(--transparent-accent-30);

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.decorated-button::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--small-border-radius);
  content: "";
  /*background: var(--sound-splitter-gradient-accent);*/

  opacity: 0;
  /*transition: opacity var(--default-transition);*/
}
.decorated-button:focus-visible {
  outline: none;
}
.decorated-button .border-holder {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;

  /* overflow: hidden; */
  border-radius: var(--small-border-radius);
  opacity: 0;
  transition: opacity var(--default-transition);
}
.decorated-button:hover .border-holder,
.decorated-button:focus .border-holder {
  opacity: 1;
  transition: opacity var(--default-transition);
}

.decorated-button .border-holder svg {
  width: 100%;
  height: 100%;
  overflow: unset;
}
.svg-holder {
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active.decorated-button::before {
  opacity: 1;
}
.decorated-button .svg-holder:deep(svg stop) {
  transition: var(--default-transition);
}
.active.decorated-button .svg-holder:deep(svg stop) {
  /* todo: need to update variables */
  stop-color: var(--sound-splitter-color-grey-4);
}
</style>
