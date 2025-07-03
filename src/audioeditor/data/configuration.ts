import { TimeSignature, TimeUnitType } from "../audiomodel/types";
import { HSLColor } from "../visualmodel/canvaspainters/GradientSliderCanvasPainter";
import { MetronomeSubdivision } from "../audiomodel/audioeditor/trackeditor/trackeditorbase/Metronome";
import { getSubdivisionByName } from "../audiomodel/audioeditor/trackeditor/trackeditorbase/metronome/constants";
import { SubdivisionSelectionMethod, ThresholdSelectionMethod } from "../store/modules/submodules/trackeditor/navigation";

interface Debug {
  isEnabled: boolean;
  primaryTimeLine: {
    gatherFormatBarDebug: boolean;
    countBarsFromZero: boolean; //TODO: not completed
  };
}
/**
 * Public project configuration. Here are the settings that the user can specify at his own discretion. Changing these settings mustn't break the application.
 */
interface AudioEditorConfiguration {
  tracksEditor: {
    appearance: {
      /* colors */
      trackOpacity: string;
      selectionCandidateOpacity: string;
      mutedBackgroundColor: string;
      mutedTrackColor: string;
      /* /colors */

      /* track zebra */
      evenTrackColor: string;
      oddTrackColor: string;
      /* /track zebra */

      /* grid */
      timeUnitType: TimeUnitType;

      gridBaseRiskWidth: number; //px
      gridBaseRiskColor: string;
      gridIntermediateRiskWidth: number; //px
      gridIntermediateRiskColor: string;

      timeLineGridBaseRiskHeight: number; //px time ruler
      timeLineGridIntermediateRiskHeight: number; //px
      /* /grid */

      /* selection */
      selectionReplaceColor: string; //hex
      selectionAddColor: string; //hex
      selectionSubstractColor: string; //hex
      selectionOpacity: string; //hex
      /* /selection */

      /* timeline */
      timeLineLabelColor: string;
      timeLineLabelFont: string;
      /* /timeline */

      trackHeight: number; //px
      segmentHeight: number; //px  =trackHeight-trackHeaderHeight
      trackVerticalGap: number; //px, vertical gap between tracks on work area

      baseRiskTimeStep: number; //seconds per risk,
      intermediateRiskCount: number; //units, number of risks between base risks,
      viewportScaleX: number; //seconds per pixel
      // trackScale?: number,
    };
    functionality: {
      tempo: number;
      timeSignature: TimeSignature;
    };
    strings: {
      musicianName: string;
      soundSource: string;
      segmentName: string;
    };
    navigation: {
      functionality: {
        timeScaleMultiplier: number;
        minTimeScale: number;
        maxTimeScale: number;
        leftWorldBorder: number; //value in seconds below which the world should not be shown
      };
      snapToGrid: {
        isEnabled: boolean;
        subdivisionSelectionMethod: SubdivisionSelectionMethod;
        explicitSubdivision: number; //in bars
        thresholdSelectionMethod: ThresholdSelectionMethod;
        explicitThreshold: number; //in px
      };
    };
    secondaryTimeLine: {
      appearance: {
        timeUnitType: TimeUnitType;
        rulerTopMargin: number; //px
        baseRiskHeight: number; //px time ruler
        intermediateRiskHeight: number; //px
        baseRiskTimeStep: number; //seconds per risk,
        intermediateRiskCount: number; //units, number of risks between base risks,
      };
    };
    track: {
      trackMixer: {
        volumeMeter: {
          appearance: {
            startRMSColor: HSLColor;
            endRMSColor: HSLColor;
            peakColor: HSLColor;
            peakThresholdCrossedColor: HSLColor;
          };
          functionality: {
            peakTimeToLive: number;
          };
        };
      };
    };
    metronome: {
      subdivision: MetronomeSubdivision;
    };
    masterMixer: {
      analyserNodeVolumeMeter: {
        functionality: {
          channelCount: number;
          peakTimeToLive: number; //seconds
        };
      };
      audioWorkletVolumeMeter: {
        functionality: {
          peakTimeToLive: number; //seconds
          expectedChannelCount: number;
          defaultTimeWindowSize: number; //samples
        };
      };
    };
  };
  offlineAudioRecorder: {
    functionality: {
      audioRecordRange: {
        start: number; //seconds
        end: number; //seconds
      };
    };
  };
  commandHistory: {
    historyLength: number;
  };
  debug: Debug;

  //TODO: rework
  midiEditor: {
    appearance: {
      /* colors */
      workAreaKeyGridWhiteKeyColor: string;
      workAreaKeyGridBlackKeyColor: string;
      workAreaKeyGridBaseKeyColor: string;
      /* /colors */
      noteHeight: number; //px
      noteWidth: number; //px

      baseRiskTimeStep: number; //seconds per risk,
      intermediateRiskCount: number; //units, number of risks between base risks,
      viewportScaleX: number; //seconds per pixel
    };
    functionality: {
      initialCursorCoordinates: {
        x: number; //seconds
        y: number; //noteUnits
      };
      initialCurrentTime: number; //seconds
      initialAudioCursorCoordinates: {
        x: number; //seconds
        y: number; //noteUnits
      };
      initialViewPortCoordinates: {
        x: number; //seconds
        y: number; //noteUnits
      };
    };
  };
}

const AUDIO_EDITOR_CONFIGURATION: AudioEditorConfiguration = {
  tracksEditor: {
    appearance: {
      /* colors */
      trackOpacity: "36",
      selectionCandidateOpacity: "90",
      mutedBackgroundColor: "#676767",
      mutedTrackColor: "#A5A5A5",
      /* /colors */

      /* track zebra */
      evenTrackColor: "#FFFFFF08",
      oddTrackColor: "#FFFFFF03",
      /* /track zebra */

      /* grid */
      timeUnitType: TimeUnitType.BEATS,
      gridBaseRiskWidth: 1, //px
      gridBaseRiskColor: "rgba(255, 255, 255, 0.07)",
      gridIntermediateRiskWidth: 1, //px
      gridIntermediateRiskColor: "rgba(255, 255, 255, 0.03)",

      timeLineGridBaseRiskHeight: 25, //px time ruler
      timeLineGridIntermediateRiskHeight: 13, //px
      /* /grid */

      /* selection */
      selectionReplaceColor: "#0000FF",
      selectionAddColor: "#00FF00",
      selectionSubstractColor: "#FF0000",
      selectionOpacity: "7F",
      /* /selection */

      /* timeline */
      timeLineLabelColor: "rgba(255, 255, 255, 0.3)",
      timeLineLabelFont: "700 8px 'Wix Madefor Text'",
      /* /timeline */

      trackHeight: 86, //px
      segmentHeight: 67, //px  =trackHeight-trackHeaderHeight
      trackVerticalGap: 4, //px, vertical gap between tracks on work area

      baseRiskTimeStep: 1, //seconds per risk,
      intermediateRiskCount: 3, //units, number of risks between base risks,
      viewportScaleX: 0.01, //seconds per pixel
    },
    functionality: {
      tempo: 120,
      timeSignature: { lower: 4, upper: 2 },
    },
    strings: {
      musicianName: "Musician Name",
      soundSource: "Sound Source",
      segmentName: "Unnamed Segment",
    },
    navigation: {
      functionality: {
        timeScaleMultiplier: 0.01,
        minTimeScale: 0.0001,
        maxTimeScale: 0.4,
        leftWorldBorder: 0,
      },
      snapToGrid: {
        isEnabled: true,
        subdivisionSelectionMethod: "CURRENT_GRID_STEP",
        explicitSubdivision: 1,
        thresholdSelectionMethod: "EXPLICIT",
        explicitThreshold: 10,
      },
    },
    secondaryTimeLine: {
      appearance: {
        timeUnitType: TimeUnitType.ABSOLUTE_TIME,
        rulerTopMargin: 11, //px
        baseRiskHeight: 15, //px time ruler
        intermediateRiskHeight: 5, //px
        baseRiskTimeStep: 1, //seconds per risk,
        intermediateRiskCount: 3, //units, number of risks between base risks,
      },
    },
    track: {
      trackMixer: {
        volumeMeter: {
          appearance: {
            startRMSColor: { hue: 120, saturation: 100, lightness: 50 },
            endRMSColor: { hue: 0, saturation: 100, lightness: 50 },
            peakColor: { hue: 0, saturation: 0, lightness: 50 },
            peakThresholdCrossedColor: { hue: 0, saturation: 100, lightness: 50 },
            // peakThresholdCrossedColor: {hue: 180, saturation: 100, lightness: 50},
          },
          functionality: {
            peakTimeToLive: 0.5,
          },
        },
      },
    },
    metronome: {
      subdivision: getSubdivisionByName("quarter"),
    },
    masterMixer: {
      analyserNodeVolumeMeter: {
        functionality: {
          channelCount: 2, //
          peakTimeToLive: 0.5,
        },
      },
      audioWorkletVolumeMeter: {
        functionality: {
          peakTimeToLive: 0.5,
          expectedChannelCount: 2,
          defaultTimeWindowSize: 1024,
        },
      },
    },
  },
  offlineAudioRecorder: {
    functionality: {
      audioRecordRange: {
        start: 0, //seconds
        end: 1.5, //seconds
      },
    },
  },
  commandHistory: {
    historyLength: 100,
  },
  debug: {
    isEnabled: false,
    primaryTimeLine: {
      gatherFormatBarDebug: false,
      countBarsFromZero: false,
    },
  },
  midiEditor: {
    appearance: {
      /* colors */
      workAreaKeyGridWhiteKeyColor: "rgba(200,200,200, 0.1)",
      workAreaKeyGridBlackKeyColor: "rgba(100,100,100, 0.1)",
      workAreaKeyGridBaseKeyColor: "rgba(200,200,200, 0.2)",
      /* /colors */
      noteHeight: 100, //px
      noteWidth: 17.24, //px

      baseRiskTimeStep: 1, //seconds per risk,
      intermediateRiskCount: 9, //units, number of risks between base risks,
      viewportScaleX: 0.01, //seconds per pixel
    },
    functionality: {
      initialCursorCoordinates: {
        x: 0, //seconds
        y: 0, //noteUnits
      },
      initialCurrentTime: 0, //seconds
      initialAudioCursorCoordinates: {
        x: 0, //seconds
        y: 0, //noteUnits
      },
      initialViewPortCoordinates: {
        x: 0, //seconds
        y: 0, //noteUnits
      },
    },
  },
};

const AUDIO_EDITOR_CONFIGURATION_EXTENDED: AudioEditorConfiguration & { tracksEditor: { appearance: { trackScale: number } } } = {
  ...AUDIO_EDITOR_CONFIGURATION,
  tracksEditor: {
    ...AUDIO_EDITOR_CONFIGURATION.tracksEditor,
    appearance: {
      ...AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance,
      trackScale: 1 / (AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackHeight + AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap),
    },
  },
};

export { AUDIO_EDITOR_CONFIGURATION_EXTENDED as AUDIO_EDITOR_CONFIGURATION };
