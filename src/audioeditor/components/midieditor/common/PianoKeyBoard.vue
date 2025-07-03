<template>
  <div v-if="position === KEYBOARD_POSITION.HORIZONTAL" ref="pianoKeyBoard" class="piano-key-board" :class="position" @pointerdown.left="keyDownHandler">
    <div v-for="octave in getPianoKeyBoardKeys" :key="octave.octaveNumber" class="octave">
      <div v-for="(keyBoardKey, index) in octave.keyBoardKeys" :key="keyBoardKey.keyName" class="keyboard-key" :data-midi-key="keyBoardKey.midiKey" :class="{ 'white-key': !isBlackKey(keyBoardKey.keyName), 'black-key': isBlackKey(keyBoardKey.keyName) }" :style="getKeyBoardKeyStyle(octave, index, keyBoardKey)">
        <!-- {{keyBoardKey.keyName}}{{ octave.octaveNumber }} -->
        {{ getKeyBoardKeyLabel(keyBoardKey.keyName, octave.octaveNumber) }}
      </div>
    </div>
  </div>
  <div v-if="position === KEYBOARD_POSITION.VERTICAL_LEFT" ref="pianoKeyBoard" class="piano-key-board" :class="position" @pointerdown.left="keyDownHandler">
    <div v-for="octave in getPianoKeyBoardKeysVerticalLeft" :key="octave.octaveNumber" class="octave">
      <div v-for="(keyBoardKey, index) in octave.keyBoardKeys" :key="keyBoardKey.keyName" class="keyboard-key" :data-midi-key="keyBoardKey.midiKey" :class="{ 'white-key': !isBlackKey(keyBoardKey.keyName), 'black-key': isBlackKey(keyBoardKey.keyName) }" :style="getKeyBoardKeyStyle(octave, index, keyBoardKey)">
        {{ getKeyBoardKeyLabel(keyBoardKey.keyName, octave.octaveNumber) }}
      </div>
    </div>
  </div>
</template>

<script>
import { getPianoKeyBoardKeys, KeyBoardKeyName, isBlackKey, OCTAVE_SEMITONES_NUMBER, OCTAVE_WHITE_KEY_NUMBER } from "@audioeditor/audiomodel/audioeditor/midieditor/midiUtils";
import { KEYBOARD_INITIAL_CONFIG, PIANO_KEY_SIZES } from "@/audioeditor/data/constants";

export const KEYBOARD_POSITION = {
  HORIZONTAL: "position-horizontal",
  VERTICAL_LEFT: "position-vertical-left", //90 degrees counterclock-wise
  VERTICAL_RIGHT: "position-vertical-right", //90 degrees counterclock-wise and flipped in horizontal direction
  HORIZONTAL_UPSIDE_DOWN: "position-horizontal-upside-down", //flipped in vertical direction
};

const KEYBOARD_LABEL_STYLE = {
  ALL_KEYS_LABELS: "ALL_KEYS_LABELS", //C0 C#0 D0 D#0 E F...
  ONLY_C_LABELS: "ONLY_C_LABELS", //C0 C1 C2...
};
const keyboardLabelStyle = KEYBOARD_LABEL_STYLE.ONLY_C_LABELS;

export default {
  name: "PianoKeyBoard",
  props: {
    startOctave: Number, //subcontroctave is 0 and 5-line octave is 8
    startKey: {
      //Do not start with blackKeys!
      type: String,
      required: false,
      default: KeyBoardKeyName.C,
    },
    endOctave: Number,
    endKey: {
      //Do not end with blackKeys!
      type: String,
      required: false,
      default: KeyBoardKeyName.C,
    },
    position: {
      type: String,
      required: false,
      default: KEYBOARD_POSITION.HORIZONTAL,
    },
    noteScale: {
      type: Number, //px
      required: true,
    },
    whiteKeyHeight: {
      type: Number,
      required: true,
    },
  },
  emits: ["piano-key-board-key-pressed", "piano-key-board-key-released"],
  data() {
    return {
      KEYBOARD_CONFIG: { ...KEYBOARD_INITIAL_CONFIG },
      KEYBOARD_POSITION,
    };
  },
  computed: {
    noteWidth() {
      return 1 / this.$props.noteScale;
    },
    whiteKeyWidth() {
      return (this.noteWidth * OCTAVE_SEMITONES_NUMBER) / OCTAVE_WHITE_KEY_NUMBER;
    },
    getBlackKeyWidth() {
      //px
      return (this.whiteKeyWidth * PIANO_KEY_SIZES.blackKeyWidth) / PIANO_KEY_SIZES.whiteKeyWidth;
    },
    getPianoKeyBoardKeys() {
      return getPianoKeyBoardKeys(this.$props.startOctave, this.$props.endOctave, this.$props.startKey, this.$props.endKey);
    },
    getPianoKeyBoardKeysVerticalLeft() {
      const pianoKeyBoardKeys = this.getPianoKeyBoardKeys;
      const flippedKeyBoardKeys = [];
      pianoKeyBoardKeys.forEach((octave) => {
        octave.keyBoardKeys = octave.keyBoardKeys.toReversed();
        flippedKeyBoardKeys.splice(0, 0, octave);
      });
      return flippedKeyBoardKeys;
    },
  },
  methods: {
    /* appearance */
    isBlackKey,
    getBlackKeyOffsetFromOctaveStart(octave, index, keyBoardKey) {
      let whiteKeysBeforeCurrentBlackKey = 0;
      for (let i = 0; i < index; i++) {
        if (!this.isBlackKey(octave.keyBoardKeys[i].keyName)) {
          whiteKeysBeforeCurrentBlackKey++;
        }
      }
      return whiteKeysBeforeCurrentBlackKey * this.whiteKeyWidth - this.KEYBOARD_CONFIG.whiteKeysGap / 2 - this.getBlackKeyWidth / 2;
    },
    getKeyBoardKeyStyle(octave, index, keyBoardKey) {
      if (!this.isBlackKey(keyBoardKey.keyName)) {
        return;
      }
      let blackKeyStyle;
      switch (this.$props.position) {
        case KEYBOARD_POSITION.VERTICAL_LEFT: {
          blackKeyStyle = {
            transform: `translateY(${this.getBlackKeyOffsetFromOctaveStart(octave, index, keyBoardKey)}px)`,
          };
          break;
        }
        case KEYBOARD_POSITION.HORIZONTAL:
        default: {
          blackKeyStyle = {
            transform: `translateX(${this.getBlackKeyOffsetFromOctaveStart(octave, index, keyBoardKey)}px)`,
          };
          break;
        }
      }
      return blackKeyStyle;
    },
    getKeyBoardKeyLabel(keyName, octaveNumber) {
      let keyBoardKeyLabel;
      switch (keyboardLabelStyle) {
        case KEYBOARD_LABEL_STYLE.ONLY_C_LABELS: {
          keyBoardKeyLabel = keyName === KeyBoardKeyName.C ? `${keyName}${octaveNumber}` : "";
          break;
        }
        case KEYBOARD_LABEL_STYLE.ALL_KEYS_LABELS:
        default: {
          keyBoardKeyLabel = `${keyName}${octaveNumber}`;
        }
      }
      return keyBoardKeyLabel;
    },
    /* /appearance */

    /* helper event handling */
    mouseOverHandler(event) {
      const pressedKey = event.target.closest(".keyboard-key");
      if (pressedKey) {
        this.keyPressedHandler(pressedKey);
      }
    },
    mouseOutHandler(event) {
      const releasedKey = event.target.closest(".keyboard-key");
      if (releasedKey) {
        this.keyReleasedHandler(releasedKey);
      }
    },
    keyUpHandler(event) {
      const releasedKey = event.target.closest(".keyboard-key");
      if (releasedKey) {
        this.keyReleasedHandler(releasedKey);
      }
      this.$refs.pianoKeyBoard.removeEventListener("mouseover", this.mouseOverHandler);
      this.$refs.pianoKeyBoard.removeEventListener("mouseout", this.mouseOutHandler);
    },
    keyDownHandler(event) {
      const pressedKey = event.target.closest(".keyboard-key");
      if (pressedKey) {
        this.keyPressedHandler(pressedKey);
      }
      this.$refs.pianoKeyBoard.addEventListener("mouseover", this.mouseOverHandler);
      this.$refs.pianoKeyBoard.addEventListener("mouseout", this.mouseOutHandler);
      document.addEventListener("pointerup", this.keyUpHandler, { once: true });
    },
    /* /helper event handling */

    /* event handling */
    keyPressedHandler(pressedKeyElement) {
      pressedKeyElement.classList.add("pressed");
      console.log({ midiKey: pressedKeyElement.dataset.midiKey });
      this.$emit("piano-key-board-key-pressed", { midiKey: pressedKeyElement.dataset.midiKey });
    },
    keyReleasedHandler(releasedKeyElement) {
      releasedKeyElement.classList.remove("pressed");
      console.log({ midiKey: releasedKeyElement.dataset.midiKey });
      this.$emit("piano-key-board-key-released", { midiKey: releasedKeyElement.dataset.midiKey });
    },
    /* /event handling */
  },
};
</script>

<style scoped>
* {
  --white-key-count: 29;
  --width-of-white-key-in-columns: 3; /* occupied space in columns by one key */
  --width-of-black-key-in-columns: 2;

  --height-of-white-key-in-columns: 5; /* occupied space in colmns by one key */
  --height-of-black-key-in-columns: 3;

  --gap-between-keys: 1px;
  --keyboard-height: 25em;

  --white-key-color: white;
  --black-key-color: black;
  --white-key-gap-color: rgb(125, 125, 125);

  --key-border-radius: var(--small-border-radius);
}

.piano-key-board {
  display: flex;
  position: relative;
  cursor: pointer;
}
.octave {
  display: flex;
  position: relative;
}
.keyboard-key {
  display: flex;
  align-items: end;
  justify-content: center;

  cursor: pointer;
  font-size: var(--smallest-font-size);
}
.white-key {
  flex-shrink: 0;
  width: v-bind("`${whiteKeyWidth}px`");
  height: v-bind("`${KEYBOARD_CONFIG.whiteKeyHeight}px`");
  background: var(--white-key-color);
  box-shadow: v-bind("`-${KEYBOARD_CONFIG.whiteKeysGap}px`") 0px 0px var(--white-key-gap-color);
}
.black-key {
  position: absolute;
  top: 0;
  width: v-bind("`${getBlackKeyWidth}px`");
  height: v-bind("`${KEYBOARD_CONFIG.blackKeyHeight}px`");
  background: var(--black-key-color);
  border-radius: 0 0 var(--key-border-radius) var(--key-border-radius);
  color: rgb(100, 100, 100);
}
.pressed {
  background: var(--color-gray-light);
}

/* position-vertical-left */
.piano-key-board.position-vertical-left {
  flex-direction: column;
}
.piano-key-board.position-vertical-left .octave {
  flex-direction: column;
}
.piano-key-board.position-vertical-left .keyboard-key {
  align-items: center;
  justify-content: end;
}
.piano-key-board.position-vertical-left .white-key {
  width: v-bind("`${KEYBOARD_CONFIG.whiteKeyHeight}px`");
  height: v-bind("`${whiteKeyWidth}px`");
  box-shadow: 0px v-bind("`-${KEYBOARD_CONFIG.whiteKeysGap}px`") 0px var(--white-key-gap-color);
}
.piano-key-board.position-vertical-left .black-key {
  left: 0;
  width: v-bind("`${KEYBOARD_CONFIG.blackKeyHeight}px`");
  height: v-bind("`${getBlackKeyWidth}px`");

  border-radius: 0 var(--key-border-radius) var(--key-border-radius) 0;
  color: rgb(100, 100, 100);
}
/* /position-vertical-left */
</style>
