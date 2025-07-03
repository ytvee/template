<template>
  <div class="transparent-button">
    <div
      :class="['ai-chat-transparent-button', {selected: isActive}, {circled: !label.length}]"
    >
      <span v-if="!!label.length">{{ label }}</span>
      <img :src="iconPath" alt="" />
    </div>
  </div>
</template>

<script>
import DefaultTooltip from "@/components/common/tooltip/DefaultTooltip.vue";

export default {
  components: { DefaultTooltip },
  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    iconPath: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      // isActive: false,
    };
  },
  computed: {},
  methods: {
    isItemSelected() {},
  },
};
</script>

<style scoped>
.transparent-button {
  user-select: none;
}

.transparent-button:hover {
  cursor: pointer;
}

.transparent-button img {
  opacity: 0.6;
  transition: opacity var(--default-transition);
}

.transparent-button:hover img,
.nav-button.selected img {
  opacity: 1;
  transition: opacity var(--default-transition);
}

.ai-chat-transparent-button {
  width: 140px;
  height: 32px;
  padding: 0 12px 0 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--transparent-light-15);
  border-radius: var(--border-radius-50);
  color: var(--audio-editor-color-white);
  transition: background var(--default-transition);
}

.ai-chat-transparent-button.circled {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  border-radius: var(--border-raduis-circle);
}

.ai-chat-transparent-button span {
  font-family: var(--wix-font-family);
  font-size: var(--regular-font-size);
}

</style>
