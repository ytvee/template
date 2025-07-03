import type { HomogeneousPoint, TransformationMatrix } from "../types";
import { MATRIX_DIMENSION } from "./MatrixUtils";

// function translate(point: Point, tx: number, ty: number) {
//   return { x: point.x + tx, y: point.y + ty };
// }
// function scale(point: Point, sx: number, sy: number) {
//   return { x: point.x * sx, y: point.y * sy }
// }

export function applyTransformation(homogeneousPoint: HomogeneousPoint, transformationMatrix: TransformationMatrix): HomogeneousPoint {
  const x = transformationMatrix[0][0] * homogeneousPoint[0] + transformationMatrix[0][1] * homogeneousPoint[1] + transformationMatrix[0][2] * homogeneousPoint[2];
  const y = transformationMatrix[1][0] * homogeneousPoint[0] + transformationMatrix[1][1] * homogeneousPoint[1] + transformationMatrix[1][2] * homogeneousPoint[2];
  const z = transformationMatrix[2][0] * homogeneousPoint[0] + transformationMatrix[2][1] * homogeneousPoint[1] + transformationMatrix[2][2] * homogeneousPoint[2];
  return [x, y, z];
}

export function copyMatrix(transformationMatrix: TransformationMatrix): TransformationMatrix {
  const matrixCopy: TransformationMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < MATRIX_DIMENSION; i++) {
    for (let j = 0; j < MATRIX_DIMENSION; j++) {
      matrixCopy[i][j] = transformationMatrix[i][j];
    }
  }
  return matrixCopy;
}
