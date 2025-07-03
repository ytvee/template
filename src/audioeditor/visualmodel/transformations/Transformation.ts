/*
===Coordinate Transitions===
======General Information=======
(x')   (a b tx)   (x)   (ax+by+tx)
|y'| = |c d ty| * |y| = |cx+dy+ty|
(1 )   (0 0 1 )   (1)   ( 1 )

Parallel Translation:
(1 0 tx)
|0 1 ty|
(0 0 1 )

Scaling:
(sx 0 0)
|0 sy 0|
(0 0 1)

(sx 0 tx)
|0 sy ty|
(0 0 1 )

F(Pscene)=Pscreen

Pscene -> translation -> scaling -> Pscreen

(x+tx)
|y+ty|
( 1 )

G = M * L

To transition between bases in space, it is necessary to use a transition matrix.
Let's imagine a vector space.
v is some vector in this space.
Va is the representation of the vector v in the basis a

Then the representation of the vector v in the basis b is related to Va by the following formula:
Vb = Pa->b * Va
where Pa->b is the transition matrix from the basis a to the basis b .

To transition back, you need to use the formula:
Va = (Pa->b)^-1 * Vb
where (Pa->b)^-1 is the inverse matrix to the matrix Pa->b

======Viewport======
This visual model has the following bases:
- object or local. Each object on the workspace has its own basis. The coordinate center is an arbitrarily chosen center of the object.
- viewport or canvas. Viewport is a special case of an object from the point of view of the world. Plays the role of a camera. Its center relative to the world is the upper left corner of the canvas.
- world. The center of the world is where the seconds (along the x-axis) and tracks (along the y-axis) count.
- tab windows. In the window basis, we get the mouse coordinates. They need to be converted to the canvas basis.

Accordingly, there are the following transition matrices:
Pobject->world
Pviewport->world
Pviewport->window

The following transitions are important for us:
Vworld -> Vviewport for displaying the world coordinate grid in the viewport.
Vobject -> Vviewport for displaying objects in the viewport.
Vviewport -> Vworld for defining the area of the world that needs to be displayed.
Vwindow -> Vworld for expressing the mouse coordinates in the world basis.

Let's write these transitions using transition matrices:
Vviewport = Fworld->viewport(Vworld) = (Pviewport->world)^-1 * Vworld
Vviewport = Fobject->viewport(Vobject) = Fworld->viewport(Pobject->world * Vobject) = (Pviewport->world)^-1 * Pobject->world * Vobject
Vworld = Fviewport->world(Vviewport) = Pviewport->world * Vviewport
Vworld = Fwindow->world(Vwindow) = Fviewport->world((Pviewport->window)^-1 * Vwindows) = Pviewport->world * (Pviewport->window)^-1 * Vwindows

Now let's write the transition matrices:
(1 0 a)
Pobject->world = |0 1 b|
(0 0 1)
where a is the offset of the object relative to the world along the OX axis,
b is the offset of the object relative to the world along the OY axis.
For now, the objects will only have translation. We will add other transformations if necessary.

(sx 0 a)
Pviewport->world = |0 sy b|
(0 0 1)
where a is the offset of the viewport relative to the world along the OX axis,
b is the offset of the viewport relative to the world along the OY axis.
sx and sy are the scale of the viewport along the OX and OY axes

(sx 0 a)
Pviewport->window = |0 sy b|
(0 0 1)
where a is the offset of the viewport relative to the window along the OX axis,
b is the offset of the viewport relative to the window along the OY axis.
sx and sy viewport scale along the OX and OY axes relative to the window

======Transitions between world units======
between seconds and ticks. The unit of the OX axis of the world is seconds. The first tick starts at the center of the world. y is the same as the world. We are not considering negative areas yet. But in terms of meaning, there should be -1 before the first tick, and -2 before -1. In this case, in the negative area, the fractions would be counted not from the origin, but from minus infinity. That is, if the size is 2/4, it should be like this: -1.1 -1.2 1.1 1.2 2.1 2.2. This is not so easy to achieve. If we consider F(xseconds) to F

So, it is important for us to have transitions:
xtick = Fseconds->tick(xseconds)
xsecond = Ftick->seconds(xtick)
*/

import { HOMOGENEOUS_Z, HomogeneousUtils } from "./MatrixUtils";
import type { Point, TransformationMatrix } from "@audioeditor/visualmodel/types";

//@ts-expect-error: no type declaration
import MatrixJs from "matrix-js";
import { applyTransformation, copyMatrix } from "./TransformationUtils";
import { ViewportState } from "@/audioeditor/store/modules/submodules/trackeditor/navigation";

export class Transformation {
  public static formTransformationMatrix(tx: number, ty: number, sx = 1, sy = 1): TransformationMatrix {
    return [
      [sx, 0, tx],
      [0, sy, ty],
      [0, 0, HOMOGENEOUS_Z],
    ];
  }
  private static getWorldToViewportTransformationMatrix(viewportToWorldTransformationMatrix: TransformationMatrix): TransformationMatrix {
    return MatrixJs(viewportToWorldTransformationMatrix).inv();
  }
  private static getObjectToViewportTransformationMatrix(viewportToWorldTransformationMatrix: TransformationMatrix, objectToWorldTransformationMatrix: TransformationMatrix): TransformationMatrix {
    return MatrixJs(this.getWorldToViewportTransformationMatrix(viewportToWorldTransformationMatrix)).prod(objectToWorldTransformationMatrix);
  }
  private static getWindowToWorldTransformationMatrix(viewportToWorldTransformationMatrix: TransformationMatrix, viewportToWindowTransformationMatrix: TransformationMatrix): TransformationMatrix {
    return MatrixJs(viewportToWorldTransformationMatrix).prod(MatrixJs(MatrixJs(viewportToWindowTransformationMatrix).inv()));
  }
  private static getWindowToViewportTransformationMatrix(viewportToWindowTransformationMatrix: TransformationMatrix): TransformationMatrix {
    return MatrixJs(viewportToWindowTransformationMatrix).inv();
  }
  public static applyTransformationToPoint(point: Point, transformationMatrix: TransformationMatrix): Point {
    const translatedPoint = applyTransformation(HomogeneousUtils.pointToHomogeneous(point), transformationMatrix); //TODO: precalc result scale and translate matrix before apply to multiple points
    const canvasPoint = HomogeneousUtils.homogeneousToPoint(translatedPoint);
    return canvasPoint;
  }

  public static worldToViewport(point: Point, viewportState: ViewportState) {
    return this.applyTransformationToPoint(point, this.getWorldToViewportTransformationMatrix(this.formTransformationMatrix(viewportState.viewportOrigin.x, viewportState.viewportOrigin.y, viewportState.viewportScaleX, viewportState.viewportScaleY)));
  }
  /**
   * Converts distance only
   * @param point
   * @param viewportState
   * @returns
   */
  public static worldToViewportDistance(point: Point, viewportState: ViewportState) {
    return this.applyTransformationToPoint(point, this.getWorldToViewportTransformationMatrix(this.formTransformationMatrix(0, 0, viewportState.viewportScaleX, viewportState.viewportScaleY)));
  }
  public static viewportToWorld(point: Point, viewportState: ViewportState) {
    return this.applyTransformationToPoint(point, this.formTransformationMatrix(viewportState.viewportOrigin.x, viewportState.viewportOrigin.y, viewportState.viewportScaleX, viewportState.viewportScaleY));
  }
  public static objectToViewport(point: Point, viewportState: ViewportState, objectOrigin: Point, objectScaleX: number, objectScaleY: number) {
    return this.applyTransformationToPoint(point, this.getObjectToViewportTransformationMatrix(this.formTransformationMatrix(viewportState.viewportOrigin.x, viewportState.viewportOrigin.y, viewportState.viewportScaleX, viewportState.viewportScaleY), this.formTransformationMatrix(objectOrigin.x, objectOrigin.y, objectScaleX, objectScaleY)));
  }
  public static windowToWorld(point: Point, viewportState: ViewportState, canvasOrigin: Point) {
    return this.applyTransformationToPoint(point, this.getWindowToWorldTransformationMatrix(this.formTransformationMatrix(viewportState.viewportOrigin.x, viewportState.viewportOrigin.y, viewportState.viewportScaleX, viewportState.viewportScaleY), this.formTransformationMatrix(canvasOrigin.x, canvasOrigin.y)));
  }
  public static windowToWorldDistance(point: Point, viewportState: ViewportState, canvasOrigin: Point) {
    return this.applyTransformationToPoint(point, this.getWindowToWorldTransformationMatrix(this.formTransformationMatrix(0, 0, viewportState.viewportScaleX, viewportState.viewportScaleY), this.formTransformationMatrix(canvasOrigin.x, canvasOrigin.y)));
  }
  public static windowToViewport(point: Point, canvasOrigin: Point) {
    return this.applyTransformationToPoint(point, this.getWindowToViewportTransformationMatrix(this.formTransformationMatrix(canvasOrigin.x, canvasOrigin.y)));
  }
  public static scaleRelativeToAuxiliaryOrigin(objectTranslationMatrix: TransformationMatrix, objectScaleMatrix: TransformationMatrix, auxiliaryOrigin: Point, scaleMatrix: TransformationMatrix): { updatedObjectTranslationMatrix: TransformationMatrix; updatedObjectScaleMatrix: TransformationMatrix } {
    //TODO: think about store several transform maitrces in object instead of objectOrigin and objectScale
    const auxiliaryToWorldMatrix = this.formTransformationMatrix(auxiliaryOrigin.x, auxiliaryOrigin.y);
    const worldToAuxiliaryMatrix = MatrixJs(auxiliaryToWorldMatrix).inv();

    const objectToAuxiliaryBasis = MatrixJs(worldToAuxiliaryMatrix).prod(MatrixJs(objectTranslationMatrix));

    const objectToAuxiliaryBasisWithScale = MatrixJs(scaleMatrix).prod(MatrixJs(objectToAuxiliaryBasis));
    const objectToAuxiliaryBasisWithScaleOnlyTransform = this.formTransformationMatrix(objectToAuxiliaryBasisWithScale[0][2], objectToAuxiliaryBasisWithScale[1][2]);

    const updatedObjectTranslationMatrix = MatrixJs(auxiliaryToWorldMatrix).prod(MatrixJs(objectToAuxiliaryBasisWithScaleOnlyTransform));

    const updatedObjectScaleMatrix: TransformationMatrix = MatrixJs(objectScaleMatrix).mul(MatrixJs(scaleMatrix));
    return { updatedObjectTranslationMatrix, updatedObjectScaleMatrix };
  }
}

export class ObjectTransformation {
  //TODO: use for navigation
  private translationMatrix: TransformationMatrix;
  private scaleMatrix: TransformationMatrix;

  private transformationMatrix: TransformationMatrix; //INFO: result matrix of translate and scale
  private inverseTransformationMatrix: TransformationMatrix;

  constructor(tx: number, ty: number, sx = 1, sy = 1) {
    this.translationMatrix = Transformation.formTransformationMatrix(tx, ty);
    this.scaleMatrix = Transformation.formTransformationMatrix(0, 0, sx, sy);

    this.transformationMatrix = MatrixJs(this.scaleMatrix).prod(MatrixJs(this.translationMatrix));
    this.inverseTransformationMatrix = MatrixJs(this.transformationMatrix).inv();
  }
  private updateResultMatrices() {
    this.transformationMatrix = MatrixJs(this.scaleMatrix).prod(MatrixJs(this.translationMatrix));
    this.inverseTransformationMatrix = MatrixJs(this.transformationMatrix).inv();
  }
  public move(tx: number, ty: number) {
    this.translationMatrix = MatrixJs(this.translationMatrix).prod(MatrixJs(Transformation.formTransformationMatrix(tx, ty)));
    this.updateResultMatrices();
  }
  public moveTo(point: Point) {
    this.translationMatrix = Transformation.formTransformationMatrix(point.x, point.y);
    this.updateResultMatrices();
  }
  public scale(sx: number, sy: number) {
    this.scaleMatrix = MatrixJs(this.scaleMatrix).prod(MatrixJs(Transformation.formTransformationMatrix(sx, sy)));
    this.updateResultMatrices();
  }
  public scaleRelativeToAuxiliaryOrigin(sx: number, sy: number, auxiliaryOrigin: Point) {
    //TODO:
    const result = Transformation.scaleRelativeToAuxiliaryOrigin(this.translationMatrix, this.scaleMatrix, auxiliaryOrigin, Transformation.formTransformationMatrix(0, 0, sx, sy));
    this.translationMatrix = result.updatedObjectTranslationMatrix;
    this.scaleMatrix = result.updatedObjectScaleMatrix;
  }
  /**
   * object space to world space
   */
  public objectToWorld(point: Point): Point {
    return Transformation.applyTransformationToPoint(point, this.transformationMatrix);
  }
  /**
   * world space to object space
   */
  public worldToObject(point: Point): Point {
    return Transformation.applyTransformationToPoint(point, this.inverseTransformationMatrix);
  }
  public getTranslationMatrix() {
    return this.translationMatrix;
  }
  public getScaleMatrix() {
    return this.scaleMatrix;
  }
  public setTranslationMatrix(translationMatrix: TransformationMatrix) {
    this.translationMatrix = translationMatrix;
    this.updateResultMatrices();
  }
  public getOrigin(): Point {
    return this.objectToWorld({ x: 0, y: 0 });
  }

  /* instance methods */
  public clone(): ObjectTransformation {
    return new ObjectTransformation(this.translationMatrix[0][2], this.translationMatrix[1][2], this.scaleMatrix[0][0], this.scaleMatrix[1][1]);
  }
  public applyFromObjectTransformation(objectTransformation: ObjectTransformation): void {
    this.translationMatrix = copyMatrix(objectTransformation.getTranslationMatrix());
    this.scaleMatrix = copyMatrix(objectTransformation.getScaleMatrix());
    this.updateResultMatrices();
  }
  /* /instance methods */
}
