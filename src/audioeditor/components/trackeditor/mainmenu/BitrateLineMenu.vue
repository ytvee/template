<template>
  <div class="line-menu bitrate-menu">
    <!-- <div class="line-menu-item with-sub-items">
      <span class="line-menu-item-subitem left" :class="{ active: isMMSSMSActive }"
        @click="setTimeUnitType(TimeUnitType.ABSOLUTE_TIME)">MM:SS.MS</span>|<span class="line-menu-item-subitem right"
        :class="{ active: isBeatsActive }" @click="setTimeUnitType(TimeUnitType.BEATS)">Beats</span>
    </div> -->
  <!-- <div class="line-menu"> -->
    <DropDown :options="options" :key="openedMenu">
      <template #trigger>
        <div class="line-menu-item project-menu">
            <div class="dropdown-trigger-button">
              <svg class="project-menu-button-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.16667 7.16667C1.70833 7.16667 1.31611 7.00361 0.99 6.6775C0.663889 6.35139 0.500556 5.95889 0.5 5.5V2.16667C0.5 1.70833 0.663333 1.31611 0.99 0.99C1.31667 0.663889 1.70889 0.500556 2.16667 0.5H5.5C5.95833 0.5 6.35083 0.663333 6.6775 0.99C7.00417 1.31667 7.16722 1.70889 7.16667 2.16667V5.5C7.16667 5.95833 7.00361 6.35083 6.6775 6.6775C6.35139 7.00417 5.95889 7.16722 5.5 7.16667H2.16667ZM2.16667 15.5C1.70833 15.5 1.31611 15.3369 0.99 15.0108C0.663889 14.6847 0.500556 14.2922 0.5 13.8333V10.5C0.5 10.0417 0.663333 9.64944 0.99 9.32333C1.31667 8.99722 1.70889 8.83389 2.16667 8.83333H5.5C5.95833 8.83333 6.35083 8.99667 6.6775 9.32333C7.00417 9.65 7.16722 10.0422 7.16667 10.5V13.8333C7.16667 14.2917 7.00361 14.6842 6.6775 15.0108C6.35139 15.3375 5.95889 15.5006 5.5 15.5H2.16667ZM10.5 7.16667C10.0417 7.16667 9.64944 7.00361 9.32333 6.6775C8.99722 6.35139 8.83389 5.95889 8.83333 5.5V2.16667C8.83333 1.70833 8.99667 1.31611 9.32333 0.99C9.65 0.663889 10.0422 0.500556 10.5 0.5H13.8333C14.2917 0.5 14.6842 0.663333 15.0108 0.99C15.3375 1.31667 15.5006 1.70889 15.5 2.16667V5.5C15.5 5.95833 15.3369 6.35083 15.0108 6.6775C14.6847 7.00417 14.2922 7.16722 13.8333 7.16667H10.5ZM10.5 15.5C10.0417 15.5 9.64944 15.3369 9.32333 15.0108C8.99722 14.6847 8.83389 14.2922 8.83333 13.8333V10.5C8.83333 10.0417 8.99667 9.64944 9.32333 9.32333C9.65 8.99722 10.0422 8.83389 10.5 8.83333H13.8333C14.2917 8.83333 14.6842 8.99667 15.0108 9.32333C15.3375 9.65 15.5006 10.0422 15.5 10.5V13.8333C15.5 14.2917 15.3369 14.6842 15.0108 15.0108C14.6847 15.3375 14.2922 15.5006 13.8333 15.5H10.5Z"
                  fill="white"
                />
              </svg>
            </div>
        </div>
      </template>
    </DropDown>
    <div class="line-menu-item">
      <div class="line-menu-item-subitem left" :class="{ active: metronome.isEnabled }" @click="toggleMetronome">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.699 3.12946C15.8491 2.74341 15.6579 2.30875 15.2718 2.15862C14.8858 2.00849 14.4511 2.19974 14.301 2.58579L12.807 6.4273L11.6248 3.4717C11.0381 2.00494 8.96183 2.00495 8.37513 3.4717L4.13788 14.0648C3.67807 15.2143 4.52465 16.4648 5.76271 16.4648H9.98255C9.99407 16.465 10.0056 16.465 10.017 16.4648H14.2372C15.4753 16.4648 16.3219 15.2143 15.8621 14.0648L13.6231 8.46743L15.699 3.12946ZM12.0106 8.47518L10.2321 4.02878C10.1483 3.81925 9.85166 3.81925 9.76785 4.02879L5.53059 14.6219C5.46491 14.7861 5.58584 14.9648 5.76271 14.9648H9.48691L12.0106 8.47518ZM11.0963 14.9648L12.8267 10.5153L14.4693 14.6219C14.535 14.7861 14.4141 14.9648 14.2372 14.9648H11.0963Z" fill="currentColor" />
        </svg>
      </div>
      <div class="line-menu-item-subitem right">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.56258 12.0622L6.54175 9.04134C6.50008 8.99967 6.46897 8.95467 6.44841 8.90634C6.42786 8.85801 6.4173 8.80579 6.41675 8.74967C6.41675 8.63856 6.45508 8.54134 6.53175 8.45801C6.60841 8.37467 6.70897 8.33301 6.83341 8.33301H13.1667C13.2917 8.33301 13.3926 8.37467 13.4692 8.45801C13.5459 8.54134 13.584 8.63856 13.5834 8.74967C13.5834 8.77745 13.5417 8.87467 13.4584 9.04134L10.4376 12.0622C10.3681 12.1316 10.2987 12.1802 10.2292 12.208C10.1598 12.2358 10.0834 12.2497 10.0001 12.2497C9.91675 12.2497 9.84036 12.2358 9.77092 12.208C9.70147 12.1802 9.63203 12.1316 9.56258 12.0622Z" fill="currentColor" />
        </svg>
      </div>
    </div>
    <div class="line-menu-item">
      <!-- <span class="integer-part-of-bitrate">{{integerPartOfBitrate}}</span>.{{ fractionalPartOfBitrate }} -->
      <div class="tempo-input-holder">
        <div contenteditable="true" ref="tempoInput" v-html="styledTempo" @input="tempoInputHandler" @beforeinput="tempoBeforeInputHandler" @keypress.enter="tempoInputEnterHandler" @focusout="tempoFocusoutHandler"></div>
      </div>
    </div>
    <div class="line-menu-item">
      <div class="line-menu-item-subitem time-signature" @click="() => $refs.timeSignatureUpper.focus()">
        <div class="time-signature-input-holder">
          <input ref="timeSignatureUpper" type="text" :value="navigationModel.beatsTimeGridOptions.timeSignature.upper" @input="timeSignatureUpperInputHandler" />
        </div>
      </div>
      /
      <div class="line-menu-item-subitem time-signature" @click="() => $refs.timeSignatureLower.focus()">
        <div class="time-signature-input-holder">
          <input ref="timeSignatureLower" type="text" :value="navigationModel.beatsTimeGridOptions.timeSignature.lower" @input="timeSignatureLowerInputHandler" />
        </div>
      </div>
    </div>
    </div>
  <!-- </div> -->
  
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import DropDown from "./DropDown.vue";
import { AUDIO_EDITOR_BASE_MODULE, AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { TimeUnitType } from "@/audioeditor/audiomodel/types";
import { nextTick } from "vue";
import { downloadFile, uploadFile } from "@/audioeditor/audiomodel/audioeditor/common/miscellaneous";

export default {
  name: "BitrateLineMenu",
  components: { DropDown },
  mounted() {
    this.handleSelectOption("Load Project"); // download all projects from backend
  },
  data() {
    return {
      lastProjectFromBackEndId: 100,
      showedProjects: [{ id: 100, label: "Loading...", }],
      openedMenu: "",
      oldCaretPosition: 0,
      oldTempoString: "",

      TimeUnitType,
      MAX_TEMPO_STRING_LENGTH: 7,
      MAX_TEMPO_FRACTIONAL_LENGTH: 2,
      MAX_TIME_SIGNATURE_STRING_LENGTH: 3,


    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      metronome: (state) => state.metronome,
      offlineRecording: (state) => state.offlineRecording,
    }),
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
      navigationModel: (state) => state,
    }),
    integerPartOfBitrate() {
      return this.bitrateValue.toFixed(2).split(".")[0];
    },
    fractionalPartOfBitrate() {
      return this.bitrateValue.toFixed(2).split(".")[1];
    },
    isMMSSMSActive() {
      return this.navigationModel.timeUnitType === TimeUnitType.ABSOLUTE_TIME;
    },
    isBeatsActive() {
      return this.navigationModel.timeUnitType === TimeUnitType.BEATS;
    },
    styledTempo() {
      const dotIndex = this.oldTempoString.indexOf(".");
      return dotIndex !== -1 ? `${this.oldTempoString.substring(0, dotIndex)}<span style="color: var(--audio-editor-color-translucent-white-1)">${this.oldTempoString.substring(dotIndex)}</span>` : this.oldTempoString;
    },
    options() {
      return [
        {
          id: 0,
          label: "New Track",
          action: () => this.handleSelectOption("New Track"),
        },
        {
          id: 1,
          label: "Save Project",
          children: [{
            id: 0,
          }],
        },
        {
          id: 2,
          label: "Load Project",
          children: this.showedProjects,
        },
        {
          id: 3,
          label: "Export",
          children: [
            {
              id: 0,
              label: "Export Stems",
              action: () => this.handleSelectOption("Export Stems"),
            },
            {
              id: 1,
              label: "Export Full Audio",
              action: () => this.handleSelectOption("Export Full Audio"),
            },
          ],
        },
      ];
    },
  },
  watch: {
    "navigationModel.beatsTimeGridOptions.tempo": {
      handler(newTempo) {
        this.oldTempoString = newTempo.toFixed(2);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setTimeUnitType"]),
    ...mapActions(AUDIO_EDITOR_BASE_MODULE, ["newProject"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["toggleMetronome", "startMixdownRecordWithOfflineAudioContext", "startTracksRecordWithOfflineAudioContext", "saveProjectToFile", "loadProjectFromFile"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setTempo", "setTimeSignature"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.PROJECT_MANAGER, ["loadProjectWithBackend", "getAllProjectsFromBackend"]),

    isSatisfyTempoPattern(tempoString) {
      // return tempoString.match(/^\d*(\.\d+)?$/);
      const regexString = `^\\d*\\.?\\d{0,${this.MAX_TEMPO_FRACTIONAL_LENGTH}}$`;
      const regex = new RegExp(regexString);
      // return tempoString.length <= this.MAX_TEMPO_STRING_LENGTH && tempoString.match(/^\d*\.?\d*$/);
      return tempoString.length <= this.MAX_TEMPO_STRING_LENGTH && tempoString.match(regex);
    },
    tempoInputEnterHandler(event) {
      event.preventDefault();
    },
    tempoBeforeInputHandler(event) {
      this.oldCaretPosition = this.getCaretPosition(this.$refs.tempoInput);
    },
    tempoInputHandler(event) {
      const text = event.target.textContent;
      if (!this.isSatisfyTempoPattern(text)) {
        this.$refs.tempoInput.innerHTML = this.styledTempo;
      } else {
        this.oldCaretPosition = this.getCaretPosition(this.$refs.tempoInput);
        this.oldTempoString = text;

        // const parsedTempo = Number.parseFloat(text);
        // if(!Number.isNaN(parsedTempo)) {
        //   this.setTempo(parsedTempo);
        // }
      }
      nextTick(() => {
        this.setCaretPosition(this.$refs.tempoInput, this.oldCaretPosition);
      });
    },
    tempoFocusoutHandler() {
      const parsedTempo = Number.parseFloat(this.oldTempoString);
      if (!Number.isNaN(parsedTempo)) {
        this.oldTempoString = parsedTempo.toFixed(2);
        this.setTempo(parsedTempo);
      }
    },
    countLengthRecursively(parent, exclusiveElement) {
      let length = 0;
      for (const childNode of parent.childNodes) {
        if (childNode === exclusiveElement) {
          return length;
        }
        if (childNode.nodeType == 3) {
          // we have a text node
          length += childNode.length;
        } else {
          length += this.countLengthRecursively(childNode, exclusiveElement);
        }
      }
      return length;
    },
    getCaretPosition(element) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const startContainter = range.startContainer;
      const startOffset = range.startOffset;
      const lengthBeforeStartContainer = this.countLengthRecursively(element, startContainter);
      return lengthBeforeStartContainer + startOffset;
    },
    setCaretPosition(element, position, recursionDepth = 0) {
      let lastTextNode = null;
      // Loop through all child nodes
      for (const node of element.childNodes) {
        if (node.nodeType == 3) {
          // we have a text node
          if (node.length >= position) {
            // finally add our range
            const range = document.createRange();
            range.setStart(node, position);
            range.collapse(true);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            return -1; // we are done
          } else {
            position -= node.length;
            lastTextNode = node;
          }
        } else {
          const result = this.setCaretPosition(node, position, recursionDepth + 1);
          if (result === -1) {
            return -1; // no need to finish the for loop
          }
          position = result.position;
          lastTextNode = result.lastTextNode;
        }
      }
      if (recursionDepth === 0 && lastTextNode !== null) {
        this.setCaretPosition({ childNodes: [lastTextNode] }, lastTextNode.length);
      }
      return { position, lastTextNode }; // needed because of recursion stuff
    },
    isTimeSignatureSatisfyPattern(timeSignatureString) {
      return timeSignatureString.length <= this.MAX_TIME_SIGNATURE_STRING_LENGTH && timeSignatureString.match(/^\d*$/);
    },
    timeSignatureUpperInputHandler({ target: { value } }) {
      if (!this.isTimeSignatureSatisfyPattern(value)) {
        this.$refs.timeSignatureUpper.value = this.navigationModel.beatsTimeGridOptions.timeSignature.upper;
      } else {
        const numberValue = Number(value);
        if (!Number.isNaN(numberValue) && numberValue > 0) {
          this.setTimeSignature({ upper: numberValue });
        }
      }
    },
    timeSignatureLowerInputHandler({ target: { value } }) {
      if (!this.isTimeSignatureSatisfyPattern(value)) {
        this.$refs.timeSignatureLower.value = this.navigationModel.beatsTimeGridOptions.timeSignature.lower;
      } else {
        const numberValue = Number(value);
        if (!Number.isNaN(numberValue) && numberValue > 0) {
          this.setTimeSignature({ lower: numberValue });
        }
      }
    },
    downloadOfflineAudioContextRecord(fileName) {
      downloadFile(this.offlineRecording.recordedBlob, fileName?? "");
    },
    async handleSelectOption(option) {
      switch(option) {
        case "New Track": {
          await this.newProject();
          break;
        }
        case "Save Project": {
          await this.saveProjectToFile();
          await this.getAllProjectsFromBackend();
          break;
        }
        case "Load Project": {
          await this.getAllProjectsFromBackend();
          break;
        }

        case "Export Stems": {
          await this.startTracksRecordWithOfflineAudioContext();
          this.downloadOfflineAudioContextRecord("individual_tracks");
          break;
        }
        case "Export Full Audio": {
          await this.startMixdownRecordWithOfflineAudioContext();
          this.downloadOfflineAudioContextRecord("mixdown");
          break;
        }

        default: {
          throw new Error("unknown menu option selected");
        }
      }
      // console.log(option);
    },
  },
};
</script>

<style scoped>
/* .bitrate-menu > .line-menu-item { */
  /* padding: 0 10px; */
/* } */

.integer-part-of-bitrate {
  color: var(--audio-editor-color-white);
}

/* .line-menu-item.tempo {
  padding: 0;
} */

.tempo-input-holder div {
  cursor: text;
  border-radius: var(--small-border-radius);
  color: var(--audio-editor-color-white);
  width: calc(7ch + 4px);
  text-align: center;
  border: 2px solid transparent;
  transition: border var(--default-transition);
}

.tempo-input-holder div:focus-visible {
  outline: none;
  border: 2px solid var(--audio-editor-color-translucent-white-1);
}

.time-signature-input-holder {
  width: calc(3ch + 4px);
}

.time-signature-input-holder input {
  padding: 0;
  color: var(--audio-editor-color-translucent-white-1);
  border-color: transparent;
  transition: border-color var(--default-transition), color var(--default-transition);
}

.time-signature-input-holder input:focus-visible,
.time-signature-input-holder input:focus {
  color: var(--audio-editor-color-white);
  border-color: var(--audio-editor-color-translucent-white-1);
}
.line-menu-item-subitem:first-child .time-signature-input-holder input {
  text-align: end;
}

.dropdown-trigger-button {
  width: 40px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--large-border-radius);
}

.project-menu-button-svg {
  opacity: 0.4;
  transition: opacity var(--default-transition);
}

.project-menu:hover .project-menu-button-svg {
  opacity: 1;
  transition: opacity var(--default-transition);
}

.dropdown-trigger-button {
  background: var(--transparent-light-149);
}
</style>
