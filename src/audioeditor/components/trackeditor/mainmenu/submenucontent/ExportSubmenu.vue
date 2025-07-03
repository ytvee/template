<template>
  <div class="export-sub-menu">
    <p class="subtitle"><span>Format</span></p>
    <div class="bordered-buttons-holder">
      <SubMenuBorderedButton v-for="button in formatButtons" :key="button.name" class="bordered-button" :content="button.value" usage-case="FORMAT_SUB_MENU" :current-format="currentFormat" :is-selected="isSelectedHandler(button.name)" @click="chooseFormatButtonHandler(button.name)" />
    </div>
    <div class="bottom-buttons-holder">
      <button class="audio-editor-button medium-button" @click="saveIndividualTracksHandler">
        {{ `Export ${tracksCount} tracks` }}
      </button>
      <button class="audio-editor-button medium-button">Export mixdown</button>
    </div>
  </div>
</template>

<script>
import SubMenuBorderedButton from "./submenucontentbutton/SubMenuBorderedButton.vue";
import { downloadFile } from "@/audioeditor/audiomodel/audioeditor/common/miscellaneous";
export default {
  name: "ExportSubmenu",
  components: {
    SubMenuBorderedButton,
  },
  props: {
    individualTracks: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      currentFormat: "",
      formatButtons: [
        { name: "wav", value: "WAV" },
        { name: "mp3", value: "MP3" },
        { name: "flac", value: "FLAC" },
        { name: "ogg", value: "OGG" },
      ],
    };
  },
  computed: {
    tracksCount() {
      return this.$props.individualTracks.length;
    },
  },
  methods: {
    chooseFormatButtonHandler(formatName) {
      this.currentFormat = formatName;
    },
    submitExportHandler() {
      if (this.currentFormat.length > 0) {
        alert(`EXPORT ${this.currentFormat}`);
        return;
      }
      alert("Choose format please");
    },
    isSelectedHandler(name) {
      return name === this.currentFormat;
    },
    saveIndividualTracksHandler() {
      // const file = this.base64ToBinary(this.individualTracks[0].binaryAudio);
      this.individualTracks.forEach((track) => {
        downloadFile(track.binaryAudio, `${track.soundSourceName}.wav`);
      });
    },
  },
};
</script>

<style scoped>
.export-sub-menus {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.subtitle {
  font-style: normal;
  font-weight: var(--regular-font-weight);
  line-height: normal;

  text-align: left;
  margin-bottom: 20px;
}
.bordered-buttons-holder {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  row-gap: var(--smallest-block-gap);
  margin-bottom: 10px;
}
.bordered-button {
  cursor: pointer;
}
.bottom-buttons-holder {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bottom-buttons-holder > *:not(:last-child) {
  margin-bottom: 5px;
}
</style>
