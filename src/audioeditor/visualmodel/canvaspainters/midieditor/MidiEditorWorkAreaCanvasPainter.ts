import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { BaseCanvasPainter } from "../BaseCanvasPainter";
// import { convertClientOffsetToWorldOffset, convertWorldOffsetToClientOffset } from "@/audioeditor/visualmodel/transformations/Transformation";
import { KeyBoardKeyName, KeyBoardKeyNameStrings, getPianoKeyBoardKeys, isBlackKey, octaveAndNoteNameByNoteValue } from "@audioeditor/audiomodel/audioeditor/midieditor/midiUtils";

type MidiKeyTracksOptions = {
  zeroOctave: number;
  zeroNoteName: KeyBoardKeyNameStrings;
};

export class MidiEditorWorkAreaCanvasPainter extends BaseCanvasPainter {
  /**
   *
   * @param viewTopBorderNoteValue
   * @param noteScale
   * @param zeroNoteName the name of note in zero note point of note. The highest note of keyboard in fact.
   */
  private drawMidiKeyTracks(viewPortCoordinatesY: number, noteScale: number, midiKeyTracksOptions: MidiKeyTracksOptions) {
    const integerViewTopBorderNoteValue = Math.floor(viewPortCoordinatesY);
    // const viewPortCoordinatesYBottom = viewPortCoordinatesY + convertClientOffsetToWorldOffset(this.canvasHeight, noteScale);
    // const integerViewBottomBorderNoteValue = Math.ceil(viewPortCoordinatesYBottom);

    // const lowestNote = octaveAndNoteNameByNoteValue(-integerViewBottomBorderNoteValue, midiKeyTracksOptions.zeroOctave, midiKeyTracksOptions.zeroNoteName);
    const highestNote = octaveAndNoteNameByNoteValue(-integerViewTopBorderNoteValue, midiKeyTracksOptions.zeroOctave, midiKeyTracksOptions.zeroNoteName);

    // const keyBoardKeys = getPianoKeyBoardKeys(lowestNote.octave, highestNote.octave, lowestNote.nodeName, highestNote.nodeName);
    // const bottomNoteValue = integerViewTopBorderNoteValue + keyBoardKeys.reduce((noteNumber, octave) => (noteNumber += octave.keyBoardKeys.length), 0) - 1;

    const noteShift = 0;
    // for (let i = 0; i < keyBoardKeys.length; i++) {
    // const currentOctave = keyBoardKeys[i];
    //   for (let j = 0; j < currentOctave.keyBoardKeys.length; j++) {
    //     let color = isBlackKey(currentOctave.keyBoardKeys[j].keyName) ? AUDIO_EDITOR_CONFIGURATION.midiEditor.appearance.workAreaKeyGridBlackKeyColor : AUDIO_EDITOR_CONFIGURATION.midiEditor.appearance.workAreaKeyGridWhiteKeyColor;
    //     color = currentOctave.keyBoardKeys[j].keyName === KeyBoardKeyName.C ? AUDIO_EDITOR_CONFIGURATION.midiEditor.appearance.workAreaKeyGridBaseKeyColor : color;
    //     this.canvasContext.fillStyle = color;
    //     const y = convertWorldOffsetToClientOffset(bottomNoteValue - noteShift - viewPortCoordinatesY, noteScale);
    //     noteShift++;
    //     this.canvasContext.fillRect(0, y, this.canvasWidth, convertWorldOffsetToClientOffset(1, noteScale));
    //   }
    // }
  }
  public drawMidiViewCanvas(viewPortCoordinatesX: number, timeScale: number, viewPortCoordinatesY: number, noteScale: number, midiKeyTracksOptions: MidiKeyTracksOptions) {
    this.clearRect();
    this.drawMidiKeyTracks(viewPortCoordinatesY, noteScale, midiKeyTracksOptions);
  }
}
