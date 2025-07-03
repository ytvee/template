<template>
  <div class="dropdown-option" @mouseenter="handleMouseEnter">
    <div class="dropdown-option-label" :class="{ selected: isSelected }">
      <span class="dropdown-option-text">
        <div class="dropdown-option-name" @click="handleClick($event, option)">
          {{ option.label }}
        </div>
        <!--        <div-->
        <!--          v-if="(editMode && isOptionEditing) || (isInputShowed && lastSavedName[0] != editingOptionName && !option.label)"-->
        <!--          class="dropdown-option-input-container"-->
        <!--        >-->
        <!--          <input-->
        <!--            id="dropdown-option-input"-->
        <!--            ref="userChatInput"-->
        <!--            v-model="editingOptionName"-->
        <!--            :placeholder="isInputShowed && 'Project Name'"-->
        <!--            type="text"-->
        <!--            @keyup.enter="handleUpdateOptionName($event, (isInputShowed && lastSavedName[0] != editingOptionName) && 'save')"-->
        <!--            autocomplete="off"-->
        <!--          />-->
        <!--        </div>-->
      </span>
      <img v-if="hasChildren" src="/assets/mainmenu/rightArrow.svg" alt="" />
      <div v-if="isSaveLoadProcess" class="fullscreen-loader"></div>
      <!--      <img-->
      <!--        class="icon-button-edit-option"-->
      <!--        v-else-if="(editMode && !isOptionEditing) || (lastSavedName[0] === editingOptionName)"-->
      <!--        src="/assets/mainmenu/edit.svg" alt=""-->
      <!--        @click="handleEditOption($event)"-->
      <!--      />-->
      <!--      <img-->
      <!--        class="icon-button-edit-option saving-button"-->
      <!--        v-else-if="isInputShowed && lastSavedName[0] != editingOptionName"-->
      <!--        src="/assets/mainmenu/confirm.svg"-->
      <!--        alt=""-->
      <!--        @click="handleUpdateOptionName($event, 'save')"-->
      <!--      />-->
      <!--      <img-->
      <!--        class="icon-button-edit-option update-project-name-button"-->
      <!--        v-else-if="editMode && isOptionEditing"-->
      <!--        src="/assets/mainmenu/confirm.svg"-->
      <!--        alt=""-->
      <!--        @click="handleUpdateOptionName($event, 'update')"-->
      <!--      />-->
    </div>
    <div v-if="isSubmenuOpened && option.label === 'Save Project'" class="dropdown-submenu-container">
      <div class="blurred-wrapper">
        <div class="dropdown-submenu-option-wrapper">
          <SaveOptionMenu :close-drop-down="closeDropDown" />
        </div>
      </div>
    </div>
    <div v-else-if="isSubmenuOpened && option.label === 'Load Project'" class="dropdown-submenu-container">
      <div class="blurred-wrapper">
        <div class="dropdown-submenu-option-wrapper">
          <LoadOptionMenu :close-drop-down="closeDropDown" />
          <!--          <DropDownOption-->
          <!--            v-for="(child, index) in option.children"-->
          <!--            :key="index" :option="child"-->
          <!--            :isSelected="selectedSubOptionIndex === index || selectedSubOptionIndex === index + 100"-->
          <!--            :isSubmenuOpened="openedSubOptionIndex === index"-->
          <!--            :closeDropDown="closeDropDown"-->
          <!--            :editMode="child.id > 100"-->
          <!--            @set-selected-option-index="setSelectedSubOptionIndex"-->
          <!--            @open-submenu="openSubOptionMenu"-->
          <!--          />-->
        </div>
      </div>
    </div>
    <div v-else-if="isSubmenuOpened" class="dropdown-submenu-container">
      <div class="blurred-wrapper">
        <div class="dropdown-submenu-option-wrapper">
          <DropDownOption v-for="(child, index) in option.children" :key="index" :option="child" :is-selected="selectedSubOptionIndex === index || selectedSubOptionIndex === index + 100" :is-submenu-opened="openedSubOptionIndex === index" :close-drop-down="closeDropDown" :edit-mode="child.id > 100" :is-input-showed="option.label === 'Save Project'" @set-selected-option-index="setSelectedSubOptionIndex" @open-submenu="openSubOptionMenu" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import DropDownOption from "./DropDownOption.vue";
// import LoaderComponent from "@/components/common/loader/LoaderComponent.vue";
import SaveOptionMenu from "@audioeditor/components/trackeditor/mainmenu/saveoptionmenu/SaveOptionMenu.vue";
import storeModules from "@/data/store/storeModules.json";
import LoadOptionMenu from "@audioeditor/components/trackeditor/mainmenu/loadoptionmenu/LoadOptionMenu.vue";

export default {
  name: "DropDownOption",
  components: { LoadOptionMenu, DropDownOption, SaveOptionMenu },
  props: {
    option: Object,
    isSelected: Boolean,
    isSubmenuOpened: Boolean,
    closeDropDown: Function,
    editMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    isInputShowed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      editingOptionName: this.$props.option?.label || "",
      isOptionEditing: this.isInputShowed || false,
      selectedSubOptionIndex: null,
      openedSubOptionIndex: null,
      lastSavedName: [null],
      historySavedNames: [],
    };
  },
  computed: {
    isSaveLoadProcess() {
      const isLoadingProcess = this.projectManagerState.loadStatus === "LOADING" || this.projectManagerState.loadStatus === "LOADED";
      return this.projectManagerState.saveStatus != "SAVING" || isLoadingProcess;
    },
    hasChildren() {
      return this.option.children && this.option.children.length > 0;
    },
    ...mapState(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, {
      projectManagerState: (state) => state,
    }),
  },
  watch: {
    isSubmenuOpened: {
      handler() {
        this.selectedSubOptionIndex = null;
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, ["updateProjectNameInBackend", "saveProjectWithBackend"]),
    ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),

    async handleUpdateOptionName(event, command = null) {
      if (!this.editingOptionName.length) {
        return;
      }
      this.isOptionEditing = false;
      this.lastSavedName.unshift(this.editingOptionName);
      event.stopPropagation();

      switch (command) {
        case "save": {
          await this.setIsLoading(true);
          await this.saveProjectWithBackend(this.editingOptionName);
          await this.setIsLoading(false);
          // this.$emit("updateTrackList");
          setTimeout(() => this.$props.closeDropDown(event, true), 300);
          break;
        }
        case "update": {
          // this.updateProjectNameInBackend(this.editingOptionName);
          break;
        }
      }
    },
    handleEditOption(event) {
      event.stopPropagation();
      this.isOptionEditing = true;
      this.editingOptionName = this.option.label;
      this.$props.closeDropDown(event, false);
    },
    handleClick(event, option) {
      if (option.action) {
        option.action();
        this.$props.closeDropDown(event, true);
      }
    },
    handleMouseEnter() {
      this.$emit("set-selected-option-index", this.option.id);
      this.$emit("open-submenu", null);
      if (this.hasChildren) {
        this.$emit("open-submenu", this.option.id);
      }
    },
    setSelectedSubOptionIndex(index) {
      this.selectedSubOptionIndex = index;
    },
    openSubOptionMenu(index) {
      if (this.openedSubOptionIndex === index) {
        this.openedSubOptionIndex = null;
      } else {
        this.openedSubOptionIndex = index;
      }
    },
  },
};
</script>

<style scoped>
.blurred-wrapper {
  backdrop-filter: var(--audio-editor-dropdown-blur);
  -webkit-backdrop-filter: var(--audio-editor-dropdown-blur);
  border-radius: var(--medium-border-radius-2);
  transition: all var(--default-transition);
  animation: var(--default-transition) show ease-in-out;
}

@keyframes show {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

.dropdown-option {
  position: relative;
}

.dropdown-submenu-container {
  position: absolute;
  left: 100%;
  top: calc(100% - 60px);
  padding-left: 21px;
  display: flex;
  flex-direction: column;
}

.dropdown-submenu-option-wrapper {
  position: relative;
  padding: 22px 14px 22px 16px;
  border-radius: var(--medium-border-radius-2);
  background-color: var(--audio-editor-dropdown-background-color-2);
  box-shadow: 0px 22px 32px 0px var(--audio-editor-dropdown-shadow-color);
}

.dropdown-option-label {
  position: relative;
  padding: 10px 13px 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  opacity: 1;

  font-family: var(--audio-editor-dropdown-font-family);
  font-size: var(--regular-font-size);
  font-weight: var(--small-font-weight);
  color: white;
}

.selected {
  background-color: var(--audio-editor-dropdown-background-color-3);
}

.dropdown-option-name {
  width: 163px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-option-input-container input {
  min-width: 187px;
  height: 36px;
  padding: 9px 16px;
  border-radius: 44px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  border: none;

  font-family: var(--audio-editor-dropdown-font-family);
  font-size: var(--regular-font-size);
  font-weight: var(--small-font-weight);
}

.dropdown-option-input-container input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style>
