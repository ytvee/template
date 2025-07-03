<template>
  <div class="save-load-demo">
    <div class="bordered-section">
      <h3>Save/Load project</h3>
      <h4>Local:</h4>
      <div class="row">
        <button class="audio-editor-button medium-button" @click="newProject">New project</button>
        <button class="audio-editor-button medium-button" @click="saveProjectToFile">Save to file</button>
        <div ref="loadFromFileRef" class="audio-editor-button medium-button" :class="{'drag-over': isDragOver}">Load from file</div>
      </div>
      <h4>With backend:</h4>
      <div class="row">
        <button class="audio-editor-button medium-button" @click="saveProjectWithBackend()">Save (default name)</button>
        <button class="audio-editor-button medium-button" @click="loadProjectWithBackend()">Load (default name)</button>
      </div>

      <div class="row">
        <div>
          <input type="text" placeholder="input project name" v-model="projectName">
        </div>
        <button class="audio-editor-button medium-button" @click="saveProjectWithBackend(projectName)">Save with name</button>
        <button class="audio-editor-button medium-button" @click="loadProjectWithBackend(projectName)">Load with name</button>
      </div>

      <div class="row">
        Save status: <span :class="{good: projectManagerState.saveStatus === 'SAVED', warn: projectManagerState.saveStatus === 'UNSAVED' || projectManagerState.saveStatus === 'SAVING', bad: projectManagerState.saveStatus === 'ERROR' }">{{ projectManagerState.saveStatus }}</span>
      </div>
      <div class="row">
        Saving progress: <span>{{ projectManagerState.savingProgress }}</span>
      </div>
      <div class="row">
        Last save time: <span>{{ projectManagerState.lastSaveTime }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { useTemplateRef } from "vue";
import { mapState, mapActions } from "vuex";
import { AUDIO_EDITOR_BASE_MODULE, AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { useDragAndDrop } from "@/audioeditor/composable/useDragAndDrop";
import { useMapActions } from "@/audioeditor/composable/utils/useStoreMaps";

export default {
  setup() {
    const storeActions = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["loadProjectFromFile"]); //TODO: move from trackEditor to projectManager
    async function loadProjectByZipHandler(zipFile) {
      await storeActions.loadProjectFromFile(zipFile);
    }


    const {isDragOver} = useDragAndDrop(useTemplateRef("loadFromFileRef"),
      {
        dropHandler: (files ) => {loadProjectByZipHandler(files[0])},
        clickHandler: (files ) => {loadProjectByZipHandler(files[0])},
      },
      {
        isMultiple: false,
      }
    );

    return {
      isDragOver
    }
  },
  data() {
    return {
      projectName: "",
    }
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, {
      projectManagerState: state => state,
    }),
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_BASE_MODULE, ["newProject"]), //TODO: move from audioEditor store module to projectManager store module
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["saveProjectToFile", "loadProjectFromFile"]), //TODO: move from trackEditor store module to projectManager store module
    ...mapActions(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, ["saveProjectWithBackend", "loadProjectWithBackend"]),
  }
}
</script>

<style scoped>
.bordered-section {
  border-radius: var(--audio-editor-default-border-radius);
  padding: var(--default-padding);
  display: flex;
  flex-direction: column;
  align-items: start;
}
.save-load-demo > *:not(:last-child) {
  margin-bottom: 20px;
}
.row {
  display: flex;
  gap: var(--smallest-block-gap);
  align-items: center;
}

span {
  color: var(--audio-editor-color-white);
}
.good {
  color: green;
}
.warn {
  color: yellow;
}
.bad {
  color: red;
}

</style>