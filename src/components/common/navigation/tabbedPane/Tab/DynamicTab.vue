<template>
  <div v-show="isCurrentTab" class="tab">
    <h2 v-show="isUpdating">Updating data...</h2>
    <div v-show="!isUpdating" class="tab-slot-holder">
      <slot />
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
export const DYNAMIC_TAB_COMPONENT_NAME = "DynamicTab";
export const CURRENT_TAB_INJECTABLE_PROPERTY = "currentTab";
export const IS_CURRENT_TAB = "isCurrentTab";

export default {
  name: DYNAMIC_TAB_COMPONENT_NAME,
  inject: [CURRENT_TAB_INJECTABLE_PROPERTY],
  provide() {
    return {
      [IS_CURRENT_TAB]: computed(() => this.isCurrentTab),
    };
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isUpdating: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isCurrentTab() {
      return this[CURRENT_TAB_INJECTABLE_PROPERTY] === this.label;
    },
  },
};
</script>
