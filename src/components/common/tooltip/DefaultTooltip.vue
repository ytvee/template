<template>
  <div
    v-if="isTooltipShowed"
    class="user-input-upload-button-tooltip-container"
    :class="forwardTo === 'left' ? 'left' : 'right'"
    :style="{ left: 28 + offsetX + 'px' }"
  >
    <div
      class="user-input-upload-button-tooltip-starter"
      :class="forwardTo === 'left' ? 'left' : 'right'"
    ></div>
    <div class="user-input-upload-button-tooltip">
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "DefaultTooltip",
  props: {
    text: {
      type: String,
      required: true
    },
    isTooltipShowed: {
      type: Boolean,
      required: true
    },
    offsetX: {
      type: Number,
      required: false,
      default: 0,
    },
    forwardTo: {
      type: String,
      required: false,
      default: "right",
    }
  }

};
</script>

<style scoped>
.user-input-upload-button-tooltip-container {
  position: absolute;
  top: 82%;
  z-index: 1000;
}

.user-input-upload-button-tooltip-starter {
  position: relative;
  top: 7px;
  width: 11px;
  height: 11px;
  border-radius: 2px;
  transform: rotate(45deg);
  background-color: var(--ai-chat-background-color-2);
  box-shadow: 0px 22px 32px 0px #0000004d;
  backdrop-filter: blur(24px);
}

.user-input-upload-button-tooltip-starter.right {
  left: 9px;
}

.user-input-upload-button-tooltip-starter.left {
  left: 110px;
}

.user-input-upload-button-tooltip {
  min-width: 135px;
  padding: 8px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-radius: 6px;
  background: var(--transparent-dark-55);
  box-shadow: 0px 22px 32px 0px #0000004d;
  backdrop-filter: blur(24px);
  z-index: 1000;
}

.user-input-upload-button-tooltip span {
  color: var(--transparent-light-60);
  font-size: var(--small-font-size);
  font-weight: var(--small-font-weight);
}
</style>