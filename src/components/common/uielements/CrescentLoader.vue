<template>
  <div class="crescent-loader">
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sound-splitter-svg-accent-gradient" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="70%" stop-color="#74de6f" />
          <stop offset="100%" stop-color="#cde768" />
        </linearGradient>
        <mask id="crescent-loader-mask" x="0" y="0" width="100%" height="100%">
          <rect width="100%" height="100%" fill="white" />
          <circle fill="black" cx="50%" cy="50%" r="50%" transform="scale(1,0.9)" transform-origin="50% 50%" />
          <rect width="100%" height="50%" fill="black" />
        </mask>
      </defs>
      <circle fill="url(#sound-splitter-svg-accent-gradient)" cx="50%" cy="50%" r="50%" mask="url(#crescent-loader-mask)" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "CrescentLoader",
};
</script>

<style scoped>
.crescent-loader {
  width: 100%;
  height: 100%;
  /* border: 1px solid blue; */
}

.crescent-loader > svg {
  width: 100%;
  height: 100%;
  animation: spin 2s linear infinite;
}
</style>
