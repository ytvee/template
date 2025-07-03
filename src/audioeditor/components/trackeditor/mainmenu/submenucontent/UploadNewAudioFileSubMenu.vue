<template>
  <div class="upload-new-audio-file-submenu">
    <span class="header">Input Tags for split:</span>
    <textarea id="" v-model="textAreaModel" class="sound-source-names-text-area" placeholder="piano, guitar, etc..." name="" cols="30" rows="10"></textarea>
    <button class="audio-editor-button medium-button" :class="{ disabled: !isTagsValid }" @click="chooseFileToSplitButtonHandler">Choose file to split</button>
  </div>
</template>

<script>
import { reactive } from "vue";
import { capitalizeFirstLetter, arrayBufferToBlob, base64ToBinary, fileToBase64 } from "@audioeditor/audiomodel/audioeditor/common/miscellaneous";
import { mapState } from "vuex";
export default {
  name: "UploadNewAudioFileSubmenu",
  data() {
    return {
      textAreaModel: "",
      individualTracks: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
    tags() {
      const tags = this.textAreaModel
        .split(/\s*,\s*/)
        .map((subString) => subString.trim())
        .filter((subString) => subString !== "");
      return tags;
    },
    isTagsValid() {
      return this.tags.length !== 0;
    },
  },
  methods: {
    chooseFileToSplitButtonHandler() {
      const input = document.createElement("input");
      input.type = "file";
      const changeCallback = async () => {
        const file = input.files[0];

        await this.fileToSplitChosenHandler({ file, tags: this.tags });
      };
      input.addEventListener("change", changeCallback);
      input.click();
    },
    async fileToSplitChosenHandler({ file, tags }) {
      await this.obtainIndividualTracksFromBackend(file, tags); //after call: this.individualTracks contiains data from backend after split

      const tracksToAdd = this.individualTracks.map((individualTrack) => {
        const trackOptions = {
          musicianName: this.user?.name || capitalizeFirstLetter(individualTrack.soundSource),
          soundSource: individualTrack.soundSource,
          segments: [
            {
              name: individualTrack.soundSource,
              startPosition: 0, //seconds
              volume: 1,
              url: URL.createObjectURL(arrayBufferToBlob(individualTrack.binaryAudio)),
            },
          ],
        };
        return trackOptions;
      });
      await this.addTracks({ commandArgs: { tracks: tracksToAdd } });
    },
    async obtainIndividualTracksFromBackend(inputTrackFile, soundSources) {
      await this.$load(async () => {
        const payload = {
          audio: await fileToBase64(inputTrackFile),
          tags: soundSources,
        };

        const {
          data: { data },
        } = await this.$api.soundSplitter.sendFileToSplit(payload);
        console.log("obtainIndividualTracksFromBackend: data=", data);
        this.individualTracks = Object.keys(data).map((key) => {
          return reactive({
            soundSource: key,
            binaryAudio: base64ToBinary(data[key]),
          });
        });
      });
    },
  },
};
</script>
<style scoped>
.header {
  align-self: start;
  margin-bottom: 5px;
  font-weight: var(--regular-font-weight);
}
.upload-new-audio-file-submenu {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sound-source-names-text-area {
  all: unset;
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  border-radius: var(--audio-editor-default-border-radius);
  padding: 5px;

  margin-bottom: 10px;
}
</style>
