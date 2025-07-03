import { MetronomeSound, MetronomeSubdivision } from "../Metronome";
const baseMetronomeSampleUrl = "metronomesounds/";
export const metronomeSounds: Array<MetronomeSound> = [
  {
    name: "wood",
    downBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
    upBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
  },
  {
    name: "electronic",
    downBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
    upBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
  },
  {
    name: "classical",
    downBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
    upBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
  },
  {
    name: "xylophone", //TODO: something like xylophone
    downBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
    upBeatSampleUrl: `${baseMetronomeSampleUrl}TODO`,
  },
  {
    name: "testMetronomeSound",
    downBeatSampleUrl: `${baseMetronomeSampleUrl}testMetronomeSoundDownBeat.wav`,
    upBeatSampleUrl: `${baseMetronomeSampleUrl}testMetronomeSoundUpBeat.wav`,
    default: true,
  },
  {
    name: "bassdrum",
    downBeatSampleUrl: `${baseMetronomeSampleUrl}bassdrum.wav`, //TODO:
    upBeatSampleUrl: `${baseMetronomeSampleUrl}bassdrum.wav`,
  },
];

export const metronomeSubdivisions: Array<MetronomeSubdivision> = [
  {
    name: "whole",
    value: "1n", //INFO: "1n" has the same duration as the "2n" in Tone.js https://github.com/Tonejs/Tone.js/issues/1292
  },
  {
    name: "half",
    value: "2n",
  },
  {
    name: "quarter",
    value: "4n",
    defalut: true,
  },
  {
    name: "eighth",
    value: "8n",
  },
  {
    name: "sixteenth",
    value: "16n",
  },
  {
    name: "thirty-second",
    value: "32n",
  },
  {
    name: "sixty-fourth",
    value: "64n",
  },
  {
    name: "one hundred twenty-eighth",
    value: "128n",
  },
];
export function getSubdivisionByName(subdivisionName: string) {
  const subdivision = metronomeSubdivisions.find((subdivision) => subdivision.name === subdivisionName);
  if (!subdivision) {
    throw new Error();
  }
  return subdivision;
}
export const defaultMetronomeValues = {
  subdivision: metronomeSubdivisions.find((subdivision) => subdivision.defalut === true) || metronomeSubdivisions[0],
  emphasizeDownbeat: true,
};

export const metronomeMessages = {
  ERRORS: {
    NO_SOUNDS: "Metromone sounds must contain at least one sound!",
    SOUND_WAS_NOT_FOUND: (name: string) => `Sound with name ${name} was not found!`,
  },
  WARNINGS: {
    NO_DEFAULT_SOUND: "Specify the default sound explicitly with the 'default' option in metronome sounds array. The first sound from the array will be used!",
  },
};
