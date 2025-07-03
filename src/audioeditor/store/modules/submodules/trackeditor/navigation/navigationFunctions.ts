import { getBarDurationSeconds } from "@audioeditor/audiomodel/Transformations";
import { TimeSignature } from "@/audioeditor/audiomodel/types";
import { NavigationState } from "../navigation";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";

/**
 * Explanation:
 * n=1,2,5
 * stepSeconds = n * 10^x;
 * stepSeconds * pxPerSecond = stepPx
 * MIN_STEP_PX < stepPx < MAX_STEP_PX
 *
 * MIN_STEP_PX < n * 10^x * pxPerSecond < MAX_STEP_PX
 * MIN_STEP_PX/pxPerSecond < n * 10^x < MAX_STEP_PX/pxPerSecond
 * MIN_STEP_PX/pxPerSecond/n < 10^x < MAX_STEP_PX/pxPerSecond/n
 * lg(MIN_STEP_PX/pxPerSecond/n) < x < lg(MAX_STEP_PX/pxPerSecond/n);
 * @param timeScale seconds per pixel
 * @returns step: step in seconds (... 0.01, 0.02, 0.05. 0.1 ...) power: power of 10 (... -2, -1, 0, 1, 2 ...)
 */
export function adaptRiskTimeStepToTimeScale(timeScale: number) {
  /**
   * the distance between the lines should not be less than this value
   */
  const MIN_STEP_PX = 40; //px
  /**
   * this is multiplier: 1,2,5 means 0.1 0.2 0.5, 0.001 0.002 0.005 etc step values
   */
  const mul = [1, 2, 5];

  const pxPerSecond = 1 / timeScale;

  let minStep = Number.POSITIVE_INFINITY;
  let minStepPower = 0;
  for (let i = 0; i < mul.length; i++) {
    const frequentX = Math.log10(MIN_STEP_PX / pxPerSecond / mul[i]);
    const x = Math.ceil(frequentX);

    const currentStep = mul[i] * 10 ** x;
    if (currentStep < minStep) {
      minStep = currentStep;
      minStepPower = x;
    }
  }
  return { step: minStep, power: minStepPower };
}

/* helpers */
function getPowerWithSubdivisionCeiled(MIN_STEP_PX: number, timeSignature: TimeSignature, pxPerBar: number): number {
  const powerWithSubdivision = Math.log2((MIN_STEP_PX * timeSignature.upper) / pxPerBar);
  const powerWithSubdivisionCeiled = Math.ceil(powerWithSubdivision);
  return powerWithSubdivisionCeiled;
}
/* /helpers */
/**
 * Explanation:
 * stepBars = 2^x (when x>=0) or 1/timeSignature.upper * 2^x (when x<=0)
 * stepBars * pxPerBar = stepPx
 * MIN_STEP_PX < stepPx < MAX_STEP_PX
 * MIN_STEP_PX < 2^x * pxPerBar (when x>=0) or 1/timeSignature.upper * 2^x * pxPerBar (when x<=0) < MAX_STEP_PX
 * MIN_STEP_PX < 2^x * pxPerBar (when x>=0) < MAX_STEP_PX or MIN_STEP_PX < 1/timeSignature.upper * 2^x * pxPerBar (when x<=0) < MAX_STEP_PX
 * log(2, MIN_STEP_PX / pxPerBar) < x (when x>=0) <  log(2, MAX_STEP_PX / pxPerBar) or log(2, MIN_STEP_PX * timeSignature.upper / pxPerBar) < x (when x<=0) <  log(2, MAX_STEP_PX * timeSignature.upper / pxPerBar)
 * => x = min (ceil(log(2, MIN_STEP_PX / pxPerBar)) (when x>=0), ceil(log(2, MIN_STEP_PX * timeSignature.upper / pxPerBar) (when x<=0))
 * (1) if log(2, MIN_STEP_PX / pxPerBar) > 0 => log(2, MIN_STEP_PX * timeSignature.upper / pxPerBar) > 0 because log2 is increasing function
 */
export function adaptRiskBeatStepToTimeScale(timeScale: number, tempo: number, timeSignature: TimeSignature) {
  /**
   * the distance between the lines should not be less than this value
   */
  const MIN_STEP_PX = 70; //px
  /**
   * the max count of intermediate marks when isSubdivided is false
   */
  const MAX_INTERMEDIATE_RISK_COUNT = 8; //in pieces
  const INTERMEDIATE_RISK_COUNT_BETWEEN_MOST_SUBDIVISIONS = 2; // the number of risks between base risks if base risks mean tiny subdivisions. Example: 3.2.1.0.1 The most subdivisions here are 1.0.1
  /**
   * this is multiplier: 1,2,5 means 0.1 0.2 0.5, 0.001 0.002 0.005 etc step values
   */

  const barDuration = getBarDurationSeconds(tempo, timeSignature);
  const pxPerBar = barDuration / timeScale;

  const powerWithNoSubdivision = Math.log2(MIN_STEP_PX / pxPerBar);
  const powerWithNoSubdivisionCeiled = Math.ceil(powerWithNoSubdivision);

  let isSubdivided;
  let power;
  let intermediateRiskCount;

  switch (
    Math.sign(powerWithNoSubdivisionCeiled) //see (1) in Explanation
  ) {
    case -1: {
      isSubdivided = true;
      power = getPowerWithSubdivisionCeiled(MIN_STEP_PX, timeSignature, pxPerBar);
      break;
    }
    case 0: {
      const powerWithSubdivisionCeiled = getPowerWithSubdivisionCeiled(MIN_STEP_PX, timeSignature, pxPerBar);

      if (powerWithSubdivisionCeiled < powerWithNoSubdivisionCeiled) {
        isSubdivided = true;
        power = powerWithSubdivisionCeiled;
      } else {
        isSubdivided = false;
        power = powerWithNoSubdivisionCeiled;
      }
      break;
    }
    case 1:
    default: {
      isSubdivided = false;
      power = powerWithNoSubdivisionCeiled;
      break;
    }
  }
  let stepBars; //INFO: step between base risks in bar units
  if (isSubdivided) {
    if (power <= 0) {
      stepBars = (1 / timeSignature.upper) * 2 ** power;
    } else {
      //TODO: implement also case when power > 0
      power = 0;
      stepBars = 1 / timeSignature.upper;
    }
    intermediateRiskCount = INTERMEDIATE_RISK_COUNT_BETWEEN_MOST_SUBDIVISIONS; //INFO: intermediate risks simply divide every base risk into two intervals
  } else {
    stepBars = 2 ** power;
    if (power === 0) {
      intermediateRiskCount = timeSignature.upper;
    } else if (stepBars <= MAX_INTERMEDIATE_RISK_COUNT) {
      intermediateRiskCount = stepBars;
    } else {
      intermediateRiskCount = MAX_INTERMEDIATE_RISK_COUNT;
    }
  }

  const result = { step: stepBars, power, isSubdivided, intermediateRiskCount };
  return result;
}

/* snap to grid */
/**
 * @returns seconds
 */
export function getSnapGridStep(state: NavigationState): number {
  let step;
  switch (state.snapToGrid.subdivisionSelectionMethod) {
    case "EXPLICIT": {
      step = state.snapToGrid.explicitSubdivision;
      break;
    }
    case "CURRENT_GRID_STEP": {
      step = (state.beatsTimeGridOptions.baseRiskBeatStep * getBarDurationSeconds(state.beatsTimeGridOptions.tempo, state.beatsTimeGridOptions.timeSignature)) / state.beatsTimeGridOptions.intermediateRiskCount;
      break;
    }
  }
  return step;
}
function getSnapGridThreshold(snapGridStep: number, state: NavigationState): number | null {
  if (state.snapToGrid.thresholdSelectionMethod === "NEAREST") {
    return null;
  } else {
    let threshold: number | null = Transformation.windowToWorldDistance({ x: state.snapToGrid.threshold, y: 0 }, state, { x: 0, y: 0 }).x;
    if (threshold >= snapGridStep / 2) {
      threshold = null;
    }
    return threshold;
  }
}
/**
 * @param timeToQuantize seconds
 * @param step seconds
 * @param threshold seconds
 */
function quantizeWithThreshold(timeToQuantize: number, step: number, threshold: number | null): number {
  const nearestGridTime = Math.round(timeToQuantize / step) * step;
  if (threshold === null) {
    return nearestGridTime;
  } else {
    if (timeToQuantize > nearestGridTime - threshold && timeToQuantize < nearestGridTime + threshold) {
      return nearestGridTime;
    } else {
      return timeToQuantize;
    }
  }
}
/**
 * @param timeToSnap seconds
 * @returns snapped value seconds
 */
export function snapToGrid(timeToSnap: number, state: NavigationState): number {
  if (!state.snapToGrid.isEnabled) {
    return timeToSnap;
  }
  const step = getSnapGridStep(state);
  const threshold = getSnapGridThreshold(step, state);
  const snappedTime = quantizeWithThreshold(timeToSnap, step, threshold);
  return snappedTime;
}
