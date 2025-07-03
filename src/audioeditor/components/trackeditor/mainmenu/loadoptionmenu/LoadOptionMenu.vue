<template>
  <div class="blurred-wrapper"></div>
  <div class="load-option-menu">
    <div v-if="downloadProjectFromBackendStatus === 'LOADING' && editingProjectName === 'nothing'" class="load-option-menu-container">Loading...</div>
    <div v-else-if="downloadProjectFromBackendStatus === 'UNLOAD'" class="load-option-menu-container">There are no projects yet</div>
    <div v-for="project in allProjectsFromBackend" :key="project.name" class="load-option-menu-container">
      <div v-if="isOldNameEditing && editingProjectName === project.name" class="dropdown-option-input-container">
        <div class="dropdown-option-input-wrapper">
          <input id="dropdown-option-input" ref="userChatInput" v-model="currentProjectName" placeholder="Project name..." autocomplete="off" @keyup.enter="handleConfirm($event, project)" />
        </div>
        <img class="icon-button-edit-option update-project-name-button" src="/assets/mainmenu/confirm.svg" alt="" @click="handleConfirm($event, project)" />
      </div>
      <div v-else class="dropdown-option-label show-name-mode" @click="handleLoadProject($event, project)">
        <div class="dropdown-option-text" :style="{ width: '187px' }">
          <div class="dropdown-option-name">{{ project.name }}</div>
        </div>
        <img v-if="downloadProjectFromBackendStatus === 'LOADING' && editingProjectName === project.name" class="icon-button-loading" src="/assets/mainmenu/loader.svg" alt="" />
        <img v-else class="icon-button-edit-option" src="/assets/mainmenu/edit.svg" alt="" @click="handleEdit($event, project)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import storeModules from "@/data/store/storeModules.json";
import applicationActions from "@/data/store/application/applicationActions.json";

export default {
  name: "LoadOptionMenu",
  props: {
    closeDropDown: Function,
  },
  data() {
    return {
      projectToUpdate: null,
      editingProjectName: "nothing",
      isOldNameEditing: false,
      currentProjectName: "",
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, {
      projectManagerState: state => state,
    }),
    allProjectsFromBackend() {
      return this.projectManagerState.allSavedProjects;
    },
    downloadProjectFromBackendStatus() {
      return this.projectManagerState.downloadProjectsStatus;
    },
  },
  mounted() {
    console.log("MOUNT:", this.allProjectsFromBackend);
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, ["addNameToHistory", "resetProjectData", "saveProjectWithBackend"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, ["updateProjectNameInBackend", "loadProjectWithBackend", "getAllProjectsFromBackend"]),
    ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),

    async handleLoadProject(event, project) {
      if (!project) {
        return;
      }
      const payload = {
        name: this.currentProjectName,
        project_uuid: project.uuid,
      };
      this.editingProjectName = "nothing";
      await this.setIsLoading(true);
      await this.loadProjectWithBackend(payload);
      await this.setIsLoading(false);
    },
    handleEdit(event, project) {
      event.stopPropagation();
      this.editingProjectName = project.name;
      this.currentProjectName = project.name;
      this.projectToUpdate = project;
      this.isOldNameEditing = true;
    },
    async handleConfirm(event, project) {
      event.stopPropagation();
      await this.updateProjectNameInBackend({
        name: this.currentProjectName,
        project_uuid: project.uuid,
      });
      this.currentProjectName = project.name;
      this.isOldNameEditing = false;
      await this.getAllProjectsFromBackend();
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

.load-option-menu {
  position: relative;
}

.load-option-menu-container {
  white-space: nowrap;
  font-family: var(--audio-editor-dropdown-font-family);
  font-size: var(--regular-font-size);
  font-weight: var(--small-font-weight);
  color: rgba(255, 255, 255, 0.5);
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

.icon-button-loading {
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
