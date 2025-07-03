<template>
  <div class="dropdown">
    <div class="dropdown-trigger-container" @click="toggleDropDown($event)">
      <slot name="trigger" />
    </div>
    <transition name="dropdown-transition">
      <div v-if="dropDownShowed" class="dropdown-container">
        <svg width="17" height="6" viewBox="0 0 17 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.25736 2.24264C6.60051 -0.100507 10.3995 -0.100505 12.7426 2.24264L16.5 6H0.5L4.25736 2.24264Z" fill="#5C5C5C" fill-opacity="0.6" />
        </svg>

        <div class="blurred-wrapper"></div>
        <div class="drop-down-options-wrapper">
          <DropDownOption v-for="(option, index) in options" :key="index" :option="option || { id: 100, label: 'There are no projects yet' }" :is-selected="selectedOptionIndex === index" :is-submenu-opened="openedSubmenuIndex === index" :close-drop-down="closeDropDown" @set-selected-option-index="setSelectedOptionIndex" @open-submenu="openSubmenu" @update-track-list="updateTrackList" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import DropDownOption from "./dropdown/DropDownOption.vue";

export default {
  name: "DropDown",
  components: {
    DropDownOption,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dropDownShowed: false,
      selectedOptionIndex: null,
      openedSubmenuIndex: null,
    };
  },
  methods: {
    updateTrackList() {
      this.$emit("updateTrackList");
    },
    setSelectedOptionIndex(index) {
      this.selectedOptionIndex = index;
    },
    openSubmenu(index) {
      if (this.openedSubmenuIndex === index) {
        this.openedSubmenuIndex = null;
      } else {
        this.openedSubmenuIndex = index;
      }
    },
    toggleDropDown(event) {
      this.dropDownShowed = !this.dropDownShowed;
      if (this.dropDownShowed) {
        // dropdownContainer.addEventListener("click", () => this.dropDownShowed = true)
        document.addEventListener("click", this.closeDropDown);
      } else {
        document.removeEventListener("click", this.closeDropDown);
      }
    },
    closeDropDown(event, force = false) {
      // console.log("$el:", this.$el.contains)
      // console.log("event.target:", event.target)

      if (!this.$el.contains(event.target) || force) {
        this.dropDownShowed = false;
        this.openedSubmenuIndex = null;
        this.selectedOptionIndex = null;
        document.removeEventListener("click", this.closeDropDown);
      }
    },
  },
};
</script>

<style scoped>
.dropdown-container {
  position: absolute;
  top: 53px;
  left: -26px;
  padding: 22px 14px 22px 16px;
  border-radius: var(--medium-border-radius-2);
  box-shadow: 0px 22px 32px 0px var(--audio-editor-dropdown-shadow-color);
  z-index: 50;
}

.dropdown-container::before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  top: -5.2px;
  left: 42.5px;
  transform: rotate(135deg);
  box-sizing: border-box;
  border-radius: 0 0 0 6px;
  background: var(--audio-editor-dropdown-background-color);
  backdrop-filter: var(--audio-editor-dropdown-blur);
  -webkit-backdrop-filter: var(--audio-editor-dropdown-blur);
  opacity: 0.1;
}

.dropdown-container svg {
  position: absolute;
  top: -6px;
  left: 41px;
  opacity: 0.9;
  z-index: 10;
}

.blurred-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--audio-editor-dropdown-background-color-2);
  backdrop-filter: var(--audio-editor-dropdown-blur);
  -webkit-backdrop-filter: var(--audio-editor-dropdown-blur);
  border-radius: var(--medium-border-radius-2);
  opacity: 1;
}

.dropdown-container:has(img) {
  min-width: 216px;
}

.dropdown-container:not(:has(img)) {
  min-width: 171px;
}

.dropdown {
  /*max-width: 150px;*/
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  box-shadow: 0px 22px 32px 0px #0000004D;
}

.dropdown-trigger-container {
  height: 100%;
}

.dropdown-transition-enter-from,
.dropdown-transition-leave-to {
  backdrop-filter: blur(0);
  -webkit-backdrop-filter: blur(0);
  transform: translateY(-20px);
  opacity: 0;
}

.dropdown-transition-enter-to,
.dropdown-transition-leave-from {
  backdrop-filter: var(--audio-editor-dropdown-blur);
  -webkit-backdrop-filter: var(--audio-editor-dropdown-blur);
  transform: translateY(0);
  opacity: 1;
}

.dropdown-transition-enter-from svg {
  opacity: 0;
}

.dropdown-transition-enter-to svg {
  opacity: 1;
}

.dropdown-transition-enter-active,
.dropdown-transition-leave-active,
.dropdown-transition-enter-active svg {
  transition: all var(--default-transition) ease-in-out;
}
</style>
