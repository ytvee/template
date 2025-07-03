<template>
  <div class="time-line-cursor" :style="{ transform: 'translateX(' + cursorClientPositionX + 'px)' }">
    <svg width="17" height="37" viewBox="0 0 17 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="17" height="37" rx="5" fill="url(#paint0_angular_1862_39892)" />
      <rect x="6" y="3" width="5" height="30" rx="2.5" fill="url(#paint1_linear_1862_39892)" />
      <defs>
        <radialGradient id="paint0_angular_1862_39892" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.5 18.5) rotate(90) scale(100 20)">
          <stop offset="0.166454" stop-color="#1C1D1F" />
          <stop offset="0.499956" stop-color="#373B3F" />
          <stop offset="0.656493" stop-color="#1C1D1F" />
          <stop offset="1" stop-color="#373B3F" />
        </radialGradient>
        <linearGradient id="paint1_linear_1862_39892" x1="5.53571" y1="2" x2="11.8334" y2="2.18052" gradientUnits="userSpaceOnUse">
          <stop stop-color="#74DE6F" />
          <stop offset="0.859375" stop-color="#CDE768" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
import { convertWorldOffsetToClientOffset } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";
export default {
  name: "TimeLineCursor",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cursorClientPositionX() {
      return this.convertWorldOffsetToClientOffset(this.$props.navigationModel.audioCursorCoordinates.x - this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX);
    },
  },
  methods: {
    convertWorldOffsetToClientOffset,
  },
};
</script>

<style scoped>
.time-line-cursor {
  position: absolute;
  left: -8px;
  pointer-events: auto;
  cursor: pointer;
}
</style>
