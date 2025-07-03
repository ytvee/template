import type { Point, HomogeneousPoint } from "../types";

export const HOMOGENEOUS_Z = 1;
export const MATRIX_DIMENSION = 3;
export class HomogeneousUtils {
  public static coordinatesToHomogeneous(x: number, y: number): HomogeneousPoint {
    return [x, y, HOMOGENEOUS_Z];
  }
  public static pointToHomogeneous(point: Point): HomogeneousPoint {
    return [point.x, point.y, HOMOGENEOUS_Z];
  }
  public static homogeneousToPoint(homogeneousPoint: HomogeneousPoint): Point {
    return { x: homogeneousPoint[0], y: homogeneousPoint[1] };
  }
}
