import { COLORS } from "@/audioeditor/data/constants";
import { getRandomInt } from "../../common/miscellaneous";
import { Track } from "./Track";
import { UniqueId } from "../../../types";

export class RandomTrackColors {
  private static getUsedIndexes(trackColorIndexes: Array<number>): Array<number> {
    const indexesCountToRemove = Math.floor(trackColorIndexes.length / COLORS.TRACK_COLORS.length) * COLORS.TRACK_COLORS.length;
    let usedIndexes;
    if (indexesCountToRemove) {
      usedIndexes = trackColorIndexes.slice(indexesCountToRemove);
      if (trackColorIndexes.length % COLORS.TRACK_COLORS.length === 0) {
        //exclude previouse color index from generation to avoid same neighbours colors
        usedIndexes.push(trackColorIndexes[indexesCountToRemove - 1]);
      }
    } else {
      usedIndexes = trackColorIndexes;
    }
    usedIndexes.sort((a, b) => a - b);
    return usedIndexes;
  }
  private static getRandomIndex(usedIndexes: Array<number>, intervalLength: number) {
    const numberOfRandomValues = intervalLength - usedIndexes.length;
    const randomValue = getRandomInt(numberOfRandomValues);
    const colorNumberToSet = randomValue + 1; //numeration from 1;

    let currentFreeColorNumber = 0;
    for (let i = 0; i < COLORS.TRACK_COLORS.length; i++) {
      if (usedIndexes.find((usedIndex) => usedIndex === i) === undefined) {
        currentFreeColorNumber++;
      }
      if (colorNumberToSet === currentFreeColorNumber) {
        return i;
      }
    }
    return 0;
  }
  /**
   * functions designed to get the color index. Getting the color goes like this:
   * 1) The color of the first track is random from the palette
   * 2) While the number of tracks does not exceed the number of colors in the palette, each track is assigned a random color from those colors in the palette that have not yet been used
   * 3) When there are more tracks than colors in the palette, the process is repeated, but the first track from the new cycle is assigned a random color from the palette, from which the color of the track before this track (the track from the old cycle) is excluded.
   * Track colors are determined when adding a track, i.e. individually, not in packs. Therefore, if you delete a track and create a new track, the color may differ even if they are within the same palette cycle.
   */
  public static generateTrackColorOld(currentTracksColorsIndexes: Array<number>) {
    const usedIndexes = this.getUsedIndexes(currentTracksColorsIndexes);
    const index = this.getRandomIndex(usedIndexes, COLORS.TRACK_COLORS.length);
    const primary = COLORS.TRACK_COLORS[index].primary;
    const text = COLORS.TRACK_COLORS[index].text;
    if (!primary || !text) {
      throw new Error(`primary=${primary} text=${text}`);
    }
    return {
      index,
      primary,
      text,
    };
  }
  private static getIntervalByY(trackY: number) {
    const minBoundary = Math.floor(trackY / COLORS.TRACK_COLORS.length) * COLORS.TRACK_COLORS.length;
    return {
      minBoundary,
      maxBoundary: minBoundary + COLORS.TRACK_COLORS.length,
    };
  }
  public static generateTrackColor(trackY: number, tracks: Map<UniqueId, Track>) {
    const interval = this.getIntervalByY(trackY);
    const tracksInInterval = Array.from(tracks.values()).filter((track) => track.y >= interval.minBoundary && track.y < interval.maxBoundary);
    const occupiedColorIndexes = tracksInInterval.map((track) => track.trackColor.index);

    const randomIndex = this.getRandomIndex(occupiedColorIndexes, COLORS.TRACK_COLORS.length);
    return randomIndex;
  }
}
