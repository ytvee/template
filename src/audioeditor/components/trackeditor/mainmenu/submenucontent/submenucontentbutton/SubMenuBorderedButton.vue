<template>
  <button :class="`${getClassName()} ${getIsSelectedBorder()}`">
    <span :class="`gradient-bordered-button-content`" :data-after="content">{{ content }}</span>
  </button>
</template>

<script>
export const buttonUsageCases = {
  FORMAT_SUB_MENU: "gradient-bordered-button",
  KEY_NOTE_SUB_MENU: "gradient-bordered-small-button",
};

export default {
  name: "SubMenuBorderedButton",
  props: {
    content: {
      type: String,
      required: true,
    },
    usageCase: {
      type: String,
      required: true,
    },
    isSelected: {
      type: Boolean,
    },
  },
  methods: {
    getClassName() {
      return buttonUsageCases[this.usageCase];
    },
    getIsSelectedBorder() {
      if (this.usageCase === buttonUsageCases.EXPORT_BUTTON) {
        return;
      }
      return this.isSelected ? "selected" : "";
    },
  },
};
</script>

<style scoped>
.gradient-bordered-button {
  all: unset;
  text-align: center;
  height: 19px;
  border: 1px solid red;
  border-radius: var(--audio-editor-default-border-radius);
  color: red;
  padding: 1px;
  position: relative;
  flex: 0 1 auto;
  cursor: pointer;
  margin: 0;
  width: 65px;
  transition: var(--default-transition);
}
.gradient-bordered-button:hover {
  transition: var(--default-transition);
}
.gradient-bordered-button.selected {
  transition: var(--default-transition);
}
.gradient-bordered-small-button {
  all: unset;
  max-width: 35px;
  height: 19px;
  border: 1px solid red;
  border-radius: var(--audio-editor-default-border-radius);
  position: relative;
  flex: 0 1 auto;
  align-items: center;
  cursor: pointer;
  transition: var(--default-transition);
}
.gradient-bordered-small-button:hover {
  transition: var(--default-transition);
}
.gradient-bordered-small-button.selected {
  transition: var(--default-transition);
}
</style>
