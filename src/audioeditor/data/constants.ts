import { TrackColor } from "../audiomodel/audioeditor/trackeditor/trackeditorbase/Track";
import { AUDIO_EDITOR_CONFIGURATION } from "./configuration";

/**
 * seconds. The time it takes for the volume to change using linearRampToValueAtTime in gain, panner and other nodes in purpose of avoid cracks.
 */
export const AUDIO_NODE_VALUE_CHANGE_TIME = 0.1;

/* for wavesurfer */
export const waveSurferConstantOptions = {
  height: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.segmentHeight,
  // progressColor: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.progressColor,
  autoScroll: false,
  minPxPerSec: 0, //NOTE: bigger values may case overflow of container and case the scroll. Be careful! [JG-469]
  cursorColor: "transparent",
  cursorWidth: 0,
  interact: false,
  hideScrollbar: true,
};
/* /for wavesurfer */

export const ICON_BY_SOUND_SOURCE = {
  drums: "DRUM",
  piano: "PIANO",
  guitar: "GUITAR",
  bass: "BASS",
  vocals: "MICRO",
  other: "SET",
};
type AudioEditorColors = {
  TRACK_COLORS: Array<Omit<TrackColor, "index">>;
  DEFAULT_TRACK_COLOR: Omit<TrackColor, "index">;
};
export const COLORS: AudioEditorColors = {
  TRACK_COLORS: [
    {
      primary: "#FF5150", //primary
      text: "#262626",
    },
    {
      primary: "#F29E1D",
      text: "#262626",
    },
    {
      primary: "#CDE768",
      text: "#262626",
    },
    {
      primary: "#52BB4D",
      text: "#262626",
    },
    {
      primary: "#0082E8",
      text: "#262626",
    },
    {
      primary: "#9932D0",
      text: "#262626",
    },
  ],
  // TRACK_COLORS: [ //test colors
  //   {
  //     primary: "#FF0000",
  //     text: "#262626",
  //   },
  //   {
  //     primary: "#00FF00",
  //     text: "#262626",
  //   },
  //   {
  //     primary: "#0000FF",
  //     text: "#262626",
  //   },
  //   {
  //     primary: "#FFFF00",
  //     text: "#262626",
  //   },
  // ],
  DEFAULT_TRACK_COLOR: {
    //in case a tool with that name is not in the list.
    primary: "#00FFFF",
    text: "#262626",
  },
};

/* Piano visual config */
// const DEFAULT_PIANO_KEY_SIZES = {
//   whiteKeyHeight: 145, //mm
//   whiteKeyWidth: 23, //mm
//   whiteKeysGap: 2, //mm
//   blackKeyWidth: 9, //mm
//   blackKeyHeight: 85 //mm
// }
export const PIANO_KEY_SIZES = {
  whiteKeyHeight: 145, //mm
  whiteKeyWidth: 23, //mm
  whiteKeysGap: 2, //mm
  blackKeyWidth: 11, //mm
  blackKeyHeight: 85, //mm
};
const WHITE_KEY_HEIGHT = 100; //px
function getKeySizesByProportions(whiteKeyHeight: number, pianoKeySizes: typeof PIANO_KEY_SIZES) {
  const KEYBOARD_CONFIG = {
    whiteKeyHeight: whiteKeyHeight,
    whiteKeyWidth: (whiteKeyHeight * pianoKeySizes.whiteKeyWidth) / pianoKeySizes.whiteKeyHeight,
    whiteKeysGap: (whiteKeyHeight * pianoKeySizes.whiteKeysGap) / pianoKeySizes.whiteKeyHeight,
    blackKeyWidth: (whiteKeyHeight * pianoKeySizes.blackKeyWidth) / pianoKeySizes.whiteKeyHeight,
    blackKeyHeight: (whiteKeyHeight * pianoKeySizes.blackKeyHeight) / pianoKeySizes.whiteKeyHeight,
  };

  return KEYBOARD_CONFIG;
}
export const KEYBOARD_INITIAL_CONFIG = getKeySizesByProportions(WHITE_KEY_HEIGHT, PIANO_KEY_SIZES);
/* /Piano visual config */
