<template>
  <div class="animation-circle">
    <svg class="circle-svg" viewBox="0 0 50 50">
      <circle class="circle-element" :class="[theme]" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
  </div>
</template>
<script>
import loaderThemes from "@/data/theme/loaderThemes.json";

export default {
  props: {
    theme: {
      type: String,
      required: false,
      default: loaderThemes.ACCENT,
    },
  },
};
</script>
<style scoped>
.animation-circle {
  position: relative;
  width: 100%;
  height: 100%;
}
.circle-svg {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
}

@keyframes rotate {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.circle-element {
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.circle-element.accent {
  stroke: var(--color-accent-primary);
}

.circle-element.dark {
  stroke: var(--color-dark);
}
</style>
