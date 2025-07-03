<template>
  <div class="switch-panel">
    <div class="tabs-container">
      <Tab
        v-for="(tab, index) in tabs"
        :key="index"
        :isActive="selectedTab === tab.label"
        :label="tab.label"
        @click="selectTab(tab.label)"
      />
      <div class="slider" :style="sliderStyle"></div>
    </div>
  </div>
</template>

<script>
import Tab from "./Tab.vue";

export default {
  components: { Tab },
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedTab: this.$props.tabs[0].label,
    };
  },
  computed: {
    activeTabIndex() {
      return this.tabs.findIndex(tab => tab.label === this.selectedTab);
    },
    sliderStyle() {
      const tabWidth = 100 / this.tabs.length;
      return {
        width: `${tabWidth}%`,
        transform: `translateX(${100 * this.activeTabIndex}%)`,
      };
    }
  },
  methods: {
    selectTab(label) {
      console.log("Switch mode is disabled for", label)
      // this.selectedTab = label;
      // this.$nextTick(() => {
      //   this.$emit("add-message-meta-data", { key: "sampleType", value: this.selectedTab });
      // });
    },
  },
};
</script>

<style scoped>
.switch-panel {
  margin-right: 10px;
  max-width: 160px;
  height: 32px;
  padding: 0 1px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: transparent;
  border-radius: 28px;
  border: 1px solid #FFFFFF1A;
  z-index: 10;
  position: relative;
}

.tabs-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.slider {
  position: absolute;
  height: 29px;
  background: var(--transparent-light-15);
  border-radius: var(--large-border-radius);
  transition: transform 0.3s ease;
  z-index: -1;
}

.switch-panel.disabled {
  background-color: grey;
  user-select: none;
}
</style>