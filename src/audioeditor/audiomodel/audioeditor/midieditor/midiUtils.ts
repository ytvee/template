export enum KeyBoardKeyName {
  "C" = "C",
  "C#" = "C#",
  "D" = "D",
  "D#" = "D#",
  "E" = "E",
  "F" = "F",
  "F#" = "F#",
  "G" = "G",
  "G#" = "G#",
  "A" = "A",
  "A#" = "A#",
  "B" = "B",
}
export type KeyBoardKeyNameStrings = keyof typeof KeyBoardKeyName;

/* piano keyboard */
type OctaveKeyBoardKey = {
  keyName: KeyBoardKeyNameStrings;
  midiKey: number;
};
type Octave = {
  octaveNumber: number;
  keyBoardKeys: Array<OctaveKeyBoardKey>;
};
function getMidiKey(octaveNumber: number, keyBoardKeyNumber: number) {
  //C of Dbl Contra octave has 0 code
  return (octaveNumber + 1) * 12 + keyBoardKeyNumber;
}
export function getPianoKeyBoardKeys(startOctave: number, endOctave: number, startKey: KeyBoardKeyNameStrings, endKey: KeyBoardKeyNameStrings): Array<Octave> {
  const keyBoardKeyNames = Object.keys(KeyBoardKeyName);
  const pianoKeyBoardKeys: Array<Octave> = [];
  for (let i = startOctave; i <= endOctave; i++) {
    const octaveKeyBoardKeys: Array<OctaveKeyBoardKey> = [];
    for (let j = i === startOctave ? keyBoardKeyNames.indexOf(startKey) : 0; j < (i === endOctave ? keyBoardKeyNames.indexOf(endKey) + 1 : keyBoardKeyNames.length); j++) {
      octaveKeyBoardKeys.push({
        keyName: keyBoardKeyNames[j] as KeyBoardKeyNameStrings,
        midiKey: getMidiKey(i, j),
      });
    }
    pianoKeyBoardKeys.push({
      octaveNumber: i,
      keyBoardKeys: octaveKeyBoardKeys,
    });
  }
  return pianoKeyBoardKeys;
}
/* piano keyboard */

export const OCTAVE_SEMITONES_NUMBER = 12;
export const OCTAVE_WHITE_KEY_NUMBER = 7;
export function octaveAndNoteNameByNoteValue(noteValue: number, zeroOctave: number, zeroNote: KeyBoardKeyNameStrings) {
  const integerNoteValue = Math.floor(noteValue);
  const keyBoardKeyNames = Object.keys(KeyBoardKeyName);

  const zeroNoteIndex = keyBoardKeyNames.indexOf(zeroNote);
  const octaveOffset = Math.floor(integerNoteValue / OCTAVE_SEMITONES_NUMBER);
  const noteOffset = integerNoteValue % OCTAVE_SEMITONES_NUMBER;

  const additionalOctave = noteOffset > 0 ? Math.floor((zeroNoteIndex + noteOffset) / OCTAVE_SEMITONES_NUMBER) : 0;

  const octave = zeroOctave + octaveOffset + additionalOctave;
  let noteIndex = (zeroNoteIndex + noteOffset) % OCTAVE_SEMITONES_NUMBER;
  noteIndex = noteIndex >= 0 ? noteIndex : OCTAVE_SEMITONES_NUMBER + noteIndex;

  const nodeName: KeyBoardKeyNameStrings = keyBoardKeyNames[noteIndex] as KeyBoardKeyNameStrings;
  return { octave, nodeName };
}
export function isBlackKey(keyName: KeyBoardKeyNameStrings): boolean {
  return keyName.charAt(keyName.length - 1) === "#";
}
