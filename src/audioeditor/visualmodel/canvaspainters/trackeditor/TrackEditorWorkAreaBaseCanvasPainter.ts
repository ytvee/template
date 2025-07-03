import { BaseCanvasPainter } from "../BaseCanvasPainter";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { getBarDurationSeconds } from "@audioeditor/audiomodel/Transformations";
import { AbsoluteTimeGridOptions, BeatsTimeGridOptions, ViewportState } from "@/audioeditor/store/modules/submodules/trackeditor/navigation";
import { TimeSignature, TimeUnitType } from "@/audioeditor/audiomodel/types";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";

/* debug */
const DEBUG_CONFIG = AUDIO_EDITOR_CONFIGURATION.debug;
const GATHER_FORMAT_BAR_DEBUG = DEBUG_CONFIG.isEnabled && DEBUG_CONFIG.primaryTimeLine.gatherFormatBarDebug;
/* /debug */

export type TimeGridOptions = {
  timeUnitType: TimeUnitType;
  absoluteTimeGridOptions?: AbsoluteTimeGridOptions;
  beatsTimeGridOptions?: BeatsTimeGridOptions;
};

type BeatGridDebug = Partial<{
  bar: number;
  wholePart: number;
  wholeSubdivisionPart: number;
  fractionalEnd: number;
  fractionalPart: number;
}>;

export abstract class TrackEditorWorkAreaBaseCanvasPainter extends BaseCanvasPainter {
  constructor(canvasRef: HTMLCanvasElement) {
    super(canvasRef);
  }

  private calcTimeRisksValues(viewportState: ViewportState, baseRiskTimeStep: number, intermediateRiskCount: number) {
    const firstBaseRiskTime = Math.floor(viewportState.viewportOrigin.x / baseRiskTimeStep) * baseRiskTimeStep;

    const firstBaseRiskX = Transformation.worldToViewport({ x: firstBaseRiskTime, y: 0 }, viewportState).x;
    const baseRiskPixelDistance = Transformation.worldToViewportDistance({ x: baseRiskTimeStep, y: 0 }, viewportState).x;

    const baseRiskCount = this.canvasWidth / baseRiskPixelDistance + 2;

    const intermediateRiskPixelDistance = baseRiskPixelDistance / (intermediateRiskCount + 1);
    return {
      firstBaseRiskTime,
      firstBaseRiskX,
      baseRiskCount,
      baseRiskPixelDistance,
      intermediateRiskPixelDistance,
    };
  }

  protected abstract drawBaseTimeGridRisk(baseRiskX: number, timeLabel: string): void;
  protected abstract drawIntermediateTimeGridRisk(baseRiskX: number): void;

  private drawAbsoluteTimeGrid(viewportState: ViewportState, absoluteTimeGridOptions: AbsoluteTimeGridOptions) {
    const { firstBaseRiskTime, firstBaseRiskX, baseRiskCount, baseRiskPixelDistance, intermediateRiskPixelDistance } = this.calcTimeRisksValues(viewportState, absoluteTimeGridOptions.baseRiskTimeStep, absoluteTimeGridOptions.intermediateRiskCount);
    for (let i = 0; i < baseRiskCount; i++) {
      const baseRiskTime = firstBaseRiskTime + absoluteTimeGridOptions.baseRiskTimeStep * i;
      const baseRiskX = firstBaseRiskX + baseRiskPixelDistance * i;
      this.drawBaseTimeGridRisk(baseRiskX, absoluteTimeGridOptions.baseRiskTimeStep >= 1 ? BaseCanvasPainter.getRiskLabelByRiskTimeMISS(baseRiskTime) : BaseCanvasPainter.getRiskLabelByRiskTimeMISSMS(baseRiskTime, absoluteTimeGridOptions.baseRiskTimeStepPower));
      for (let j = 1; j < absoluteTimeGridOptions.intermediateRiskCount + 1; j++) {
        this.drawIntermediateTimeGridRisk(baseRiskX + intermediateRiskPixelDistance * j);
      }
    }
  }

  private calcBeatsValues(viewportState: ViewportState, beatsTimeGridOptions: BeatsTimeGridOptions) {
    const barStepSeconds = beatsTimeGridOptions.baseRiskBeatStep * getBarDurationSeconds(beatsTimeGridOptions.tempo, beatsTimeGridOptions.timeSignature);
    const stepBeforeFirstCount = Math.floor(viewportState.viewportOrigin.x / barStepSeconds);
    const firstBarValue = stepBeforeFirstCount * beatsTimeGridOptions.baseRiskBeatStep;
    const firstBarValueSeconds = stepBeforeFirstCount * barStepSeconds;
    const firstBarX = Transformation.worldToViewport({ x: firstBarValueSeconds, y: 0 }, viewportState).x;
    const baseRiskPixelDistance = Transformation.worldToViewportDistance({ x: barStepSeconds, y: 0 }, viewportState).x;

    const baseRiskCount = this.canvasWidth / baseRiskPixelDistance + 2;

    const intermediateRiskPixelDistance = baseRiskPixelDistance / beatsTimeGridOptions.intermediateRiskCount;
    return {
      firstBarValue,
      firstBarX,
      baseRiskCount,
      baseRiskPixelDistance,
      intermediateRiskPixelDistance,
    };
  }
  /* helpers */
  /**
   *
   * @param fractionalPart
   * @returns wholeSubdivisionPart: base subdivision of bar, mostSubdivisionString: string with subdivisions of wholeSubdivisionPart
   */
  private getSubdivisions(fractionalPart: number, power: number, timeSignature: TimeSignature, debug: BeatGridDebug) {
    let quotient = fractionalPart;
    let mostSubdivisionString = "";
    for (let i = 1; i <= -power; i++) {
      let reminder1 = quotient % 2; // 2 is radix
      quotient = Math.floor(quotient / 2);
      if (!(DEBUG_CONFIG.isEnabled && DEBUG_CONFIG.primaryTimeLine.countBarsFromZero)) {
        reminder1 += 1;
      }
      mostSubdivisionString = `.${reminder1}` + mostSubdivisionString;
    }
    const wholeSubdivisionPart = quotient % timeSignature.upper;
    if (GATHER_FORMAT_BAR_DEBUG) debug.wholeSubdivisionPart = wholeSubdivisionPart;
    return { wholeSubdivisionPart, mostSubdivisionString };
  }
  private formatString(isSubdivided: boolean, sign: number, wholePart: number, wholeSubdivisionPart?: number, mostSubdivisionString?: string): string {
    let formatedString: string;
    const signString = sign === -1 ? "-" : "";
    if (!(DEBUG_CONFIG.isEnabled && DEBUG_CONFIG.primaryTimeLine.countBarsFromZero)) {
      wholePart += 1;
      if (wholeSubdivisionPart !== undefined) {
        wholeSubdivisionPart += 1;
      }
    }
    if (isSubdivided) {
      formatedString = `${signString}${wholePart}.${wholeSubdivisionPart}${mostSubdivisionString}`;
    } else {
      formatedString = `${signString}${wholePart}`;
    }
    return formatedString;
  }
  /* /helpers */
  /**
   *
   * @param bar //in bars (0 is 0, 1 is 1 bar and so on).  counts from zero
   * @returns
   */
  private formatBar(bar: number, timeSignature: TimeSignature, isSubdivided: boolean, power: number) {
    const debug: BeatGridDebug = {};
    const sign = Math.sign(bar);
    bar = Math.abs(bar);
    let formatedString;

    if (isSubdivided) {
      const mostFractional = bar * timeSignature.upper * 2 ** -power;
      const mostFractionalRounded = Math.round(mostFractional);

      let wholePart = Math.floor(mostFractionalRounded / (timeSignature.upper * 2 ** -power));
      if (GATHER_FORMAT_BAR_DEBUG) debug.wholePart = wholePart;

      let fractionalPart = mostFractionalRounded - wholePart * timeSignature.upper * 2 ** -power;
      if (sign === -1) {
        if (fractionalPart) {
          fractionalPart = timeSignature.upper * 2 ** -power - fractionalPart;
        } else {
          wholePart -= 1;
        }
      }
      if (GATHER_FORMAT_BAR_DEBUG) debug.fractionalPart = fractionalPart;

      const { wholeSubdivisionPart, mostSubdivisionString } = this.getSubdivisions(fractionalPart, power, timeSignature, debug);
      formatedString = this.formatString(isSubdivided, sign, wholePart, wholeSubdivisionPart, mostSubdivisionString);
    } else {
      if (sign === -1) {
        bar -= 1;
      }
      formatedString = this.formatString(isSubdivided, sign, bar);
    }
    return { formattedBar: formatedString, debug };
  }
  private drawBeatsTimeGrid(viewportState: ViewportState, beatsTimeGridOptions: BeatsTimeGridOptions) {
    const { firstBarValue, firstBarX, baseRiskCount, baseRiskPixelDistance, intermediateRiskPixelDistance } = this.calcBeatsValues(viewportState, beatsTimeGridOptions);

    const debug = [];
    for (let i = 0; i < baseRiskCount; i++) {
      const beatX = firstBarX + baseRiskPixelDistance * i;
      const { debug: formatBarDebug, formattedBar } = this.formatBar(firstBarValue + i * beatsTimeGridOptions.baseRiskBeatStep, beatsTimeGridOptions.timeSignature, beatsTimeGridOptions.isSubdivided, beatsTimeGridOptions.power);
      this.drawBaseTimeGridRisk(beatX, formattedBar);
      if (GATHER_FORMAT_BAR_DEBUG) debug.push(formatBarDebug);

      for (let j = 1; j < beatsTimeGridOptions.intermediateRiskCount; j++) {
        this.drawIntermediateTimeGridRisk(beatX + intermediateRiskPixelDistance * j);
      }
    }
  }

  protected drawTimeGrid(viewportState: ViewportState, timeGridOptions: TimeGridOptions) {
    switch (timeGridOptions.timeUnitType) {
      case TimeUnitType.ABSOLUTE_TIME: {
        if (!timeGridOptions.absoluteTimeGridOptions) {
          throw new Error();
        }
        this.drawAbsoluteTimeGrid(viewportState, timeGridOptions.absoluteTimeGridOptions);
        break;
      }
      case TimeUnitType.BEATS: {
        if (!timeGridOptions.beatsTimeGridOptions) {
          throw new Error();
        }
        this.drawBeatsTimeGrid(viewportState, timeGridOptions.beatsTimeGridOptions);
        break;
      }
      default: {
        throw new Error("wrong parameters in drawTimeGrid");
      }
    }
  }
}
