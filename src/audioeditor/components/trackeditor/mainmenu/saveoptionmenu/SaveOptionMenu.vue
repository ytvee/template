<template>
  <div class="blurred-wrapper"></div>
  <div class="save-option-menu">
    <div v-show="!isOldNameEditing && editingProjectName === 'nothing'" class="dropdown-option-input-container">
      <div class="dropdown-option-input-wrapper">
        <input id="dropdown-option-input" ref="userChatInput" v-model="currentProjectName" placeholder="Project name..." autocomplete="off" @keyup.enter="handleConfirm($event, currentProjectName)" />
      </div>
      <img class="icon-button-edit-option update-project-name-button" src="/assets/mainmenu/confirm.svg" alt="" @click="handleConfirm($event, currentProjectName)" />
    </div>
    <div v-for="savedProject in savedNamesHistory" :key="savedProject.savedNameId" class="save-option-menu-container">
      <div v-if="isOldNameEditing && editingProjectName === savedProject.name" class="dropdown-option-input-container">
        <div class="dropdown-option-input-wrapper">
          <input id="dropdown-option-input" ref="userChatInput" v-model="currentProjectName" placeholder="Project name..." autocomplete="off" @keyup.enter="handleConfirm($event, currentProjectName)" />
        </div>
        <img class="icon-button-edit-option update-project-name-button" src="/assets/mainmenu/confirm.svg" alt="" @click="handleConfirm($event, savedProject.savedNameId)" />
      </div>
      <div v-else-if="savedNamesHistory[0]?.name !== 'Project name template'" class="dropdown-option-label show-name-mode" @click="handleOptionClick($event, savedProject.name)">
        <div class="dropdown-option-text" :style="{ width: '187px' }">
          <div class="dropdown-option-name">{{ savedProject.name }}</div>
        </div>
        <img class="icon-button-edit-option" src="/assets/mainmenu/edit.svg" alt="" @click="handleEdit($event, savedProject.name)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import storeModules from "@/data/store/storeModules.json";
import { useMapActions } from "@audioeditor/composable/utils/useStoreMaps";
import { useDragAndDrop } from "@audioeditor/composable/useDragAndDrop";
import { useTemplateRef } from "vue";

export default {
  name: "SaveOptionMenu",
  props: {
    closeDropDown: Function,
  },
  setup() {
    const storeActions = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["loadProjectFromFile"]); //TODO: move from trackEditor to projectManager
    async function loadProjectByZipHandler(zipFile) {
      await storeActions.loadProjectFromFile(zipFile);
    }

    const { isDragOver } = useDragAndDrop(
      useTemplateRef("loadFromFileRef"),
      {
        dropHandler: (files) => {
          loadProjectByZipHandler(files[0]);
        },
        clickHandler: (files) => {
          loadProjectByZipHandler(files[0]);
        },
      },
      {
        isMultiple: false,
      }
    );

    return {
      isDragOver,
    };
  },
  data() {
    return {
      editingProjectName: "nothing",
      projectUuid: "0xf321fj24f9348gh34fqwfqw",
      isOldNameEditing: false,
      currentProjectName: "",
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, {
      projectManagerState: (state) => state,
    }),
    savedNamesHistory() {
      return this.projectManagerState.projectData.savedNamesHistory;
    },
    currentProjectUuid() {
      return this.projectManagerState.currentProjectUuid;
    },
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, ["addNameToHistory", "resetProjectData", "saveProjectWithBackend", "getAllProjectsFromBackend"]),
    ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),

    handleOptionClick(event, projectName) {
      this.currentProjectName = projectName;
      this.handleConfirm(event);
    },
    handleEdit(event, projectName) {
      event.stopPropagation();
      this.editingProjectName = projectName;
      this.currentProjectName = projectName;
      this.isOldNameEditing = true;
    },
    async handleConfirm(event) {
      event.stopPropagation();

      if (!this.currentProjectName.length) {
        console.log("Write the name");
        return;
      }

      this.isOldNameEditing = false;
      await this.setIsLoading(true);
      await this.addNameToHistory(this.currentProjectName);
      await this.saveProjectWithBackend(this.currentProjectName, this.currentProjectUuid);
      await this.setIsLoading(false);

      this.currentProjectName = "";
      this.editingProjectName = "nothing";
      console.log("TODO: add emit to update load menu");
      await this.getAllProjectsFromBackend();
      console.log("TODO: test setup and without setup in save option menu");

      setTimeout(() => this.$props.closeDropDown(event, true), 300);
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

.save-option-menu {
  position: relative;
}

.dropdown-option-label,
.dropdown-option-input-container {
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

.dropdown-option-label:hover {
  background-color: var(--audio-editor-dropdown-background-color-3);
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

.dropdown-option-name {
  width: 163px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
