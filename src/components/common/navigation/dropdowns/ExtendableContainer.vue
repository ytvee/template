<template>
  <div class="extendable-container">
    <div class="select-container" :class="{ active: isListActive }" @click="toggleListActivation">
      <h4>
        <slot name="header" />
      </h4>
      <div class="select-container-arrow">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1.5L9 9.5L17 1.5" stroke="#D9D9D9" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <div ref="extendableContainerDropdown" class="extendable-container-dropdown" :class="{ scrollable: maxHeightToExpand !== undefined }">
      <div class="padding" />
      <slot name="content" :container-toggled-callback="containerToggledCallback" />
      <div class="padding" />
    </div>
  </div>
</template>

<script>
import { IS_CURRENT_TAB } from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import { IS_MODAL_VISIBLE } from "@/components/common/modal/ModalWindow.vue";
const EPSILON_PIXELS = 0; //extra pixels to cover rounding inaccuracies

export default {
  name: "ExtendableContainer",
  inject: [IS_CURRENT_TAB, IS_MODAL_VISIBLE],
  props: {
    maxHeightToExpand: {
      type: Number,
      required: false,
      default: undefined,
    },
    containerToggledCallbackFromParentContainer: {
      //This is callback from parent extendable container. if it is defined then this exemplar is nested component and it have to call this function when this exemplar is toggled.
      required: false,
      default: undefined,
      type: Object,
    },
    debugPrefix: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["extendable-container-toggled"],
  data() {
    return {
      isListActive: true,
      requiredDropdownHeight: 0, //The height of full expanded dropdown
    };
  },
  computed: {
    IS_CURRENT_TAB() {
      return this[IS_CURRENT_TAB];
    },
    IS_MODAL_VISIBLE() {
      return this[IS_MODAL_VISIBLE];
    },
  },
  watch: {
    isListActive(newIsListActive) {
      this.toggleDropdownContainerListHeight(newIsListActive);
    },
    IS_CURRENT_TAB: {
      handler() {
        this.$nextTick(() => {
          this.toggleDropdownContainerListHeight(this.isListActive);
        });
      },
    },
    IS_MODAL_VISIBLE: {
      handler(newIsModalVisible) {
        if (newIsModalVisible) {
          this.$nextTick(() => {
            if (this.$props.debugPrefix) {
              console.log("watch: IS_MODAL_VISIBLE=", IS_MODAL_VISIBLE);
            }
            this.toggleDropdownContainerListHeight(this.isListActive);
          });
        } else {
          this.requiredDropdownHeight = 0;
          if (this.$refs.extendableContainerDropdown) {
            this.$refs.extendableContainerDropdown.style.height = "";
          }
        }
      },
      immediate: true,
    },
    maxHeightToExpand: {
      handler() {
        this.toggleDropdownContainerListHeight(this.isListActive);
      },
    },
  },
  mounted() {
    this.toggleDropdownContainerListHeight(this.isListActive);
  },
  methods: {
    toggleListActivation() {
      this.isListActive = !this.isListActive;
    },
    getUpperConstrainedValue(value, upperConstraint) {
      const result = upperConstraint === undefined || value <= upperConstraint ? value : upperConstraint;
      return result;
    },
    toggleDropdownContainerListHeight(newIsListActive) {
      const oldHeight = Number(this.$refs.extendableContainerDropdown.style.height.slice(0, -2));
      const oldRequiredDropdownHeight = this.requiredDropdownHeight;

      if (this.$props.debugPrefix) {
        console.log("toggleDropdownContainerListHeight: oldHeight", oldHeight, "oldRequiredDropdownHeight", oldRequiredDropdownHeight);
      }

      let heightToSet = undefined;
      if (newIsListActive) {
        if (this.$props.debugPrefix) {
          console.log("toggleDropdownContainerListHeight: this.requiredDropdownHeight=", this.requiredDropdownHeight, "this.$refs.extendableContainerDropdown.scrollHeight=", this.$refs.extendableContainerDropdown.scrollHeight);
        }

        if (this.requiredDropdownHeight < this.$refs.extendableContainerDropdown.scrollHeight + EPSILON_PIXELS) {
          this.requiredDropdownHeight = this.$refs.extendableContainerDropdown.scrollHeight + EPSILON_PIXELS;
        }
        heightToSet = this.getUpperConstrainedValue(this.requiredDropdownHeight, this.$props.maxHeightToExpand);
      } else {
        this.requiredDropdownHeight = 0;
        heightToSet = "";
      }

      if (this.$props.debugPrefix) {
        console.log("toggleDropdownContainerListHeight: heightToSet=", heightToSet);
      }

      if (heightToSet) {
        this.$refs.extendableContainerDropdown.style.height = heightToSet + "px";
      } else {
        this.$refs.extendableContainerDropdown.style.height = "";
      }
      if (this.$props.containerToggledCallbackFromParentContainer !== undefined) {
        //we need to call this function only if we are in nested container
        const additionalHeight = this.requiredDropdownHeight - oldRequiredDropdownHeight;
        this.$props.containerToggledCallbackFromParentContainer(additionalHeight);
      }

      if (this.$props.debugPrefix) {
        console.log("toggleDropdownContainerListHeight:  this.$refs.extendableContainerDropdown.style.height", this.$refs.extendableContainerDropdown.style.height);
      }
    },
    adjustHeightAfterNestedContainerToggled(additionalHeight) {
      this.requiredDropdownHeight = this.requiredDropdownHeight + additionalHeight;
      // const heightToSetAfterAdjust = Number(this.$refs.extendableContainerDropdown.style.height.slice(0, -2)) + Number(additionalHeight) + "px";
      const heightToSetAfterAdjust = this.getUpperConstrainedValue(this.requiredDropdownHeight, this.$props.maxHeightToExpand);
      this.$refs.extendableContainerDropdown.style.height = heightToSetAfterAdjust + "px";
    },
    containerToggledCallback(additionalHeightOfNestedContainer) {
      //For cases when container have nested container. When nested container toggles the wrapper container need to chainge its height. This function locates in parent container and has to be called by nested container.
      if (this.$props.debugPrefix) {
        console.log("containerToggledCallback: additionalHeightOfNestedContainer=", additionalHeightOfNestedContainer);
      }

      this.adjustHeightAfterNestedContainerToggled(additionalHeightOfNestedContainer);
      // this.toggleDropdownContainerListHeight(this.isListActive);
    },
  },
};
</script>

<style scoped>
.extendable-container {
  width: 100%;
}

.select-container {
  display: flex;
  padding: 0.9375rem 0;
  justify-content: space-between;
  align-items: center;
}

.select-container-arrow svg path {
  stroke: var(--color-gray);
}

.select-container .select-container-arrow {
  display: flex;
  transition: var(--default-transition);
}

.select-container.active .select-container-arrow {
  transform: rotate(180deg);
  transition: var(--default-transition);
}

.extendable-container-dropdown {
  overflow: hidden;
  height: 0px;
  transition: height var(--default-transition);

  /* border: 1px solid red; */
}

.extendable-container-dropdown.scrollable {
  overflow-y: auto;
}
.padding {
  height: 0.3125rem;
}
</style>
