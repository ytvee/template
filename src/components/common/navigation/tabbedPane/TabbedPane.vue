<template>
  <div class="tabbed-pane">
    <div class="tabbed-pane-header">
      <ul class="tabbed-pane-switches">
        <li
          v-for="tabSwitch in tabsSwitches"
          :key="tabSwitch.id"
          :class="{
            disabled: tabSwitch.isDisabled,
            active: tabSwitch.label === currentTabLabel,
          }"
          class="tabbed-pane-switch"
          @click="selectTab(tabSwitch)"
        >
          {{ tabSwitch.label }}
          <div v-if="tabSwitch.isBadgeDispay" class="badge">
            {{ tabSwitch.badge }}
          </div>
        </li>
      </ul>
    </div>
    <div class="tabs-wrapper">
      <slot />
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { DYNAMIC_TAB_COMPONENT_NAME, CURRENT_TAB_INJECTABLE_PROPERTY } from "./Tab/DynamicTab.vue";

const NOT_A_TAB_MESSAGE = "Tabbed pane child is not a Tab!";
const ACTIVE_INDEX_OUT_OF_BOUNDS = "Initial active tab index is out of bounds!";

export default {
  provide() {
    return {
      [CURRENT_TAB_INJECTABLE_PROPERTY]: computed(() => this.currentTabLabel),
    };
  },
  props: {
    initialActiveTabIndex: {
      type: Number,
      required: false,
      default: +0,
    },
    initialActiveTabLabel: {
      //if we do not want to take into consideration order of tabs.
      type: String,
      required: false,
      default: null,
    },
    affectedRouteParam: {
      //tab selection leads to route change
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      tabs: [],
      tabsSwitches: [],
      currentTabLabel: {},
    };
  },
  created() {
    this.getTabsRefs();
    this.validateTabs();
    this.validateInitialActiveTabIndex();
    this.tabsSwitches = this.getTabsSwitches();
    // this.currentTabLabel = this.tabsSwitches[this.initialActiveTabIndex].label;
    this.setInitialTabLabel();
  },
  methods: {
    setInitialTabLabel() {
      if (
        this.$props.initialActiveTabLabel &&
        this.tabsSwitches.find((item) => {
          return item.label === this.$props.initialActiveTabLabel;
        }) !== undefined
      ) {
        this.currentTabLabel = this.$props.initialActiveTabLabel;
      } else {
        this.currentTabLabel = this.tabsSwitches[this.initialActiveTabIndex].label;
      }
    },
    getTabsRefs() {
      this.tabs = this.$slots?.default();
    },
    validateTabs() {
      this.tabs.forEach((tab) => {
        if (!this.isTab(tab)) {
          throw new Error(NOT_A_TAB_MESSAGE);
        }
      });
    },
    validateInitialActiveTabIndex() {
      if (this.initialActiveTabIndex < 0 || this.initialActiveTabIndex > this.tabs.length - 1) {
        throw new Error(ACTIVE_INDEX_OUT_OF_BOUNDS);
      }
    },
    getTabsSwitches() {
      return this.tabs.map((tab, index) => {
        return tab.props
          ? {
              id: index,
              label: tab.props.label,
              isDisabled: tab.props.isDisabled,
              badge: tab.props.badge,
              isBadgeDispay: Boolean(tab.props.badge),
            }
          : {
              id: index,
              label: index,
              isDisabled: false,
              badge: "",
              isBadgeDispay: false,
            };
      });
    },
    obtainRouteParamValueFromTabLabel(tabLabel) {
      return tabLabel.charAt(0).toLowerCase() + tabLabel.slice(1);
    },
    obtainURIToPushWithoutUpdates(newParamValue) {
      const paramName = this.$props.affectedRouteParam;
      const pathTemplate = this.$route.matched[0].path;
      const path = this.$route.path;

      const indexOfParam = pathTemplate.indexOf(`:${{ paramName }}`);
      const numberOfSlashes = pathTemplate.slice(0, indexOfParam).split("/").length - 1;
      const newPathArray = path.split("/");
      newPathArray[numberOfSlashes] = newParamValue;
      return newPathArray.join("/");
    },
    selectTab(tabSwitch) {
      this.currentTabLabel = tabSwitch.label;
      if (this.$props.affectedRouteParam) {
        // this.$router.replace({ params: { [this.$props.affectedRouteParam]: this.obtainRouteParamValueFromTabLabel(tabSwitch.label) } });
        window.history.replaceState({}, "", this.obtainURIToPushWithoutUpdates(this.obtainRouteParamValueFromTabLabel(tabSwitch.label)));
      }
    },
    isTab(tab) {
      return tab.type.name === DYNAMIC_TAB_COMPONENT_NAME;
    },
  },
};
</script>
<style>
.tabbed-pane {
  color: var(--color-light);
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 15px;
  background: var(--color-accent-primary);
  color: var(--color-dark);
  border-radius: var(--border-raduis-circle);
  font-size: var(--small-font-size);
  padding: 1px;
  text-align: center;
}

.tabbed-pane-switches {
  list-style: none;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
}

.tabbed-pane-switch {
  position: relative;
  cursor: pointer;
  padding-right: var(--regular-padding);
  margin-right: 25px;
  font-size: var(--h3-font-size);
  font-weight: var(--h3-font-weight);
  color: var(--color-light);
  transition: var(--default-transition);
  transition: var(--default-transition);
}

.tabbed-pane-switch:hover,
.tabbed-pane-switch.active {
  color: var(--color-accent-primary);
}

.tabbed-pane-switch.disabled {
  user-select: none;
  pointer-events: none;
  color: var(--color-gray-medium) !important;
}

.tabbed-pane-switch:last-child {
  margin-right: 0;
}
</style>
