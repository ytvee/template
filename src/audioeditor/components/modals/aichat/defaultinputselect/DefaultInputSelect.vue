<template>
  <div
      class="default-input-select"
      :class="{ expanded: dropDownShowed, disabled: disabled }"
      @click="toggleDropDown($event)"
  >
    <div class="input-select-dropdown-trigger-container">
      <span class="input-select-label">{{ triggerLabel }}</span>
      <svg
          :class="{ expandedbottom: dropDownShowed && !isChatActive,
                    expandedup: dropDownShowed && isChatActive
          }"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.64948 10.4922L5.23281 8.07558C5.19948 8.04224 5.17459 8.00624 5.15815 7.96758C5.1417 7.92891 5.13326 7.88713 5.13281 7.84224C5.13281 7.75336 5.16348 7.67558 5.22481 7.60891C5.28615 7.54224 5.36659 7.50891 5.46615 7.50891H10.5328C10.6328 7.50891 10.7135 7.54224 10.7748 7.60891C10.8361 7.67558 10.8666 7.75336 10.8661 7.84224C10.8661 7.86447 10.8328 7.94224 10.7661 8.07558L8.34948 10.4922C8.29392 10.5478 8.23837 10.5867 8.18281 10.6089C8.12726 10.6311 8.06615 10.6422 7.99948 10.6422C7.93281 10.6422 7.8717 10.6311 7.81615 10.6089C7.76059 10.5867 7.70503 10.5478 7.64948 10.4922Z"
          fill="white" />
      </svg>
    </div>
    <transition name="input-select-dropdown-transition">
      <div
          class="input-select-dropdown-container"
          :class="{reverse: isChatActive}"
          v-if="variant === 'dropdown' && dropDownShowed"
      >
        <div class="blurred-wrapper"></div>
        <div class="input-select-drop-down-options-wrapper">
          <div
            v-for="option in options" :key="option.id"
            class="option-container"
            @click="selectOptionHandle(option.label)"
          >
            <span>{{ option.label }}</span>
            <svg
              v-show="selectedOption === option.label"
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.20628 5.69284L8.49776 0.401361C8.66218 0.236936 8.87145 0.154724 9.12556 0.154724C9.37967 0.154724 9.58894 0.236936 9.75336 0.401361C9.91779 0.565785 10 0.775052 10 1.02916C10 1.28327 9.91779 1.49254 9.75336 1.65697L3.83408 7.57625C3.65471 7.75562 3.44544 7.84531 3.20628 7.84531C2.96711 7.84531 2.75785 7.75562 2.57848 7.57625L0.246636 5.24441C0.0822119 5.07999 0 4.87072 0 4.61661C0 4.3625 0.0822119 4.15323 0.246636 3.9888C0.411061 3.82438 0.620329 3.74217 0.874439 3.74217C1.12855 3.74217 1.33782 3.82438 1.50224 3.9888L3.20628 5.69284Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import DropDown from "@audioeditor/components/trackeditor/mainmenu/DropDown.vue";
import DropDownOption from "@audioeditor/components/trackeditor/mainmenu/dropdown/DropDownOption.vue";

export default {
  name: "InputSelect",
  components: { DropDownOption, DropDown },
  props: {
    variant: {
      type: String,
      required: true,
    },
    triggerLabel: {
      type: String,
      required: true,
    },
    isChatActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      dropDownShowed: false,
    };
  },
  methods: {
    selectOptionHandle(optionLabel) {
      if (!(this.selectedOption === optionLabel)) {
        this.$nextTick(() => {
          this.$emit("add-message-meta-data", { key: "swing", value: optionLabel });
        });
        return;
      }
      this.$nextTick(() => {
        this.$emit("add-message-meta-data", { key: "swing", value: "" });
      });
    },
    toggleDropDown() {
      this.dropDownShowed = !this.dropDownShowed;
      if (this.dropDownShowed) {
        document.addEventListener("click", this.closeDropDown);
      } else {
        document.removeEventListener("click", this.closeDropDown);
      }
    },
    closeDropDown(event, force = false) {
      if (force || !this.$el.contains(event.target)) {
        this.dropDownShowed = false;
        document.removeEventListener("click", this.closeDropDown);
      }
    }
  }
};
</script>

<style scoped>
.default-input-select {
  padding: 9px 9px 9px 12px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 50px;
  border: 1px solid var(--transparent-light-10);
  color: var(--ai-chat-color-white);
  transition: all var(--default-transition) ease-in-out;
}

.default-input-select:hover,
.default-input-select.expanded {
  background-color: #FFFFFF1A;
}

.input-select-dropdown-trigger-container {
  display: flex;
  gap: 4px;
  opacity: 1;
}

.input-select-label {
  font-family: "Wix Madefor Text", sans-serif;
  font-weight: 400;
  font-size: 12px;
}

.input-select-dropdown-trigger-container svg {
  transform: rotate(-90deg);
  transition: all var(--default-transition) ease-in-out;
}

.input-select-dropdown-trigger-container svg.expandedbottom {
  rotate: 90deg;
}

.input-select-dropdown-trigger-container svg.expandedup {
  rotate: -90deg;
}

.input-select-dropdown-transition-enter-from,
.input-select-dropdown-transition-leave-to {
  opacity: 0;
}

.input-select-dropdown-transition-enter-to,
.input-select-dropdown-transition-leave-from {
  opacity: 1;
}

.input-select-dropdown-transition-enter-active,
.input-select-dropdown-transition-leave-active {
  transition: all var(--default-transition) ease-in-out;
}

.input-select-dropdown-container {
  position: absolute;
  padding: 8px 10px;
  top: 44px;
  left: -10px;
  /* padding: 22px 14px 22px 16px; */
  border-radius: var(--medium-border-radius-2);
  /* box-shadow: 0px 22px 32px 0px #0000004D; */
  z-index: 50;
}

.input-select-dropdown-container.reverse {
  position: absolute;
  top: -140px;
  left: 0px;
  padding: 8px 10px;
  border-radius: var(--medium-border-radius-2);
  background: #373737;
  border-radius: 15px;
  box-shadow: 0px 22px 32px 0px #0000004D;
  z-index: 50;
}

.blurred-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: var(--audio-editor-dropdown-background-color-2);
  backdrop-filter: var(--audio-editor-dropdown-blur);
  -webkit-backdrop-filter: var(--audio-editor-dropdown-blur);
  border-radius: var(--medium-border-radius-2);
  opacity: 1;
  z-index: -1;
}

.option-container {
  width: 190px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
  z-index: 1;
}

.option-container:hover {
  background-color: #FFFFFF1A;
}

</style>