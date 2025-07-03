export enum TimeUnitType {
  ABSOLUTE_TIME = "ABSOLUTE_TIME",
  BEATS = "BEATS",
  //SAMPLES = "SAMPLES",
}
export type TimeSignature = {
  upper: number;
  lower: number;
};
/**
 * Unique identifier type for trackId, segmentId, etc
 */
export type UniqueId = string;

export type ColorString = string;

/**
 * https://stackoverflow.com/questions/74633877/typescript-optional-type-does-not-allow-recursive-partial-utility-type-to-work
 */
export type RecursivePartial<T> = T extends Date
  ? T // Leave Date objects alone
  : // Also of note: possibly add cases for Set, Map, other JS builtins...
  T extends (infer U)[]
  ? RecursivePartial<U>[] // Recurse into array types!
  : T extends {}
  ? { [P in keyof T]?: RecursivePartial<T[P]> } // Recurse into object types!
  : T;
