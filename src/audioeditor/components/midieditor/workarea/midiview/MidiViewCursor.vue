<template>
  <div class="audio-view-cursor" :style="{ transform: 'translateX(' + cursorClientPositionX + 'px)' }">
    <div class="arrow-holder">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.86603 7.5C5.48112 8.16667 4.51887 8.16667 4.13397 7.5L0.669873 1.5C0.284973 0.833333 0.766098 5.89981e-08 1.5359 1.26296e-07L8.4641 7.31979e-07C9.2339 7.99277e-07 9.71503 0.833334 9.33013 1.5L5.86603 7.5Z" fill="url(#paint0_linear_1861_39170)" />
        <defs>
          <linearGradient id="paint0_linear_1861_39170" x1="12.1143" y1="9.4" x2="-2.57798" y2="6.87304" gradientUnits="userSpaceOnUse">
            <stop stop-color="#74DE6F" />
            <stop offset="0.859375" stop-color="#CDE768" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
import { convertWorldOffsetToClientOffset } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";
export default {
  name: "AudioViewCursor",
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
.audio-view-cursor {
  position: absolute;
  height: 100%;
  width: 1px;
  background: red;
  display: flex;
  justify-content: center;
}
.arrow-holder {
  position: absolute;
  bottom: calc(var(--audio-editor-time-line-height) + 2px);
  display: flex;
}
</style>
