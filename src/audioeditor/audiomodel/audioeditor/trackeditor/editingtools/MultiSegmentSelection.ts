import { UniqueId } from "@/audioeditor/audiomodel/types";
import { Track } from "../trackeditorbase/Track";
import { Point, TransformationMatrix } from "@/audioeditor/visualmodel/types";
import { TrackEditorApiForEditingTools } from "../BaseTrackEditor";
import { ObjectTransformation, Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { SaveLoadManager } from "../trackeditorbase/SaveLoadManager";
import { MultiSegmentSelectionSave } from "./Clipboard";
import { SegmentOptions } from "../trackeditorbase/track/SegmentFactory";
//TODO: add namespace

export type SelectionItem = {
  // trackId: UniqueId;
  segmentId: UniqueId;
};
export type MultiSegmentSelectionSelection = Array<SelectionItem>;
// export type Selection;
/**
 * axis-aligned bounding box
 */
type AABB = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
export type MultiSegmentSelectionMode = "replace" | "add" | "substract";

export class MultiSegmentSelection {
  private trackEditorApi: TrackEditorApiForEditingTools;
  private tracks: Map<UniqueId, Track>;
  private _selection: MultiSegmentSelectionSelection;
  public get selection(): MultiSegmentSelectionSelection {
    return structuredClone(this._selection);
  }

  public selectionMode: MultiSegmentSelectionMode;
  private _selectionCandidates: MultiSegmentSelectionSelection;
  public get selectionCandidates(): MultiSegmentSelectionSelection {
    return structuredClone(this._selectionCandidates);
  }

  private isBoxSelectionStarted: boolean;
  private boxSelectionStartPoint: Point;
  private _boxSelectionEndPoint: Point;
  public get boxSelectionEndPoint(): Point {
    return this._boxSelectionEndPoint;
  }

  constructor(trackEditorApiForEditingTools: TrackEditorApiForEditingTools) {
    this.trackEditorApi = trackEditorApiForEditingTools;
    this.tracks = this.trackEditorApi.getInstance().tracks; //TODO: remove tracks field. Use only api if possible
    this._selection = [];
    this._selectionCandidates = [];
    this.selectionMode = "replace";

    this.isBoxSelectionStarted = false;
    this.boxSelectionStartPoint = this._boxSelectionEndPoint = { x: 0, y: 0 };
  }
  private addToSelection(selectionItem: SelectionItem, selection: MultiSegmentSelectionSelection) {
    const existingItemIndex = selection.findIndex((existingSelectionItem) => existingSelectionItem.segmentId === selectionItem.segmentId);
    if (existingItemIndex !== -1) {
      selection.splice(existingItemIndex, 1);
    }
    selection.push(selectionItem);
  }
  public addItemsToSelection(selectionItems: MultiSegmentSelectionSelection) {
    // this.addToSelection(selectionItems, this._selection);
    this.candidatesToSelection(selectionItems, "add");
  }
  private substractFromSelection(selectionItem: SelectionItem, selection: MultiSegmentSelectionSelection) {
    const existingItemIndex = selection.findIndex((existingSelectionItem) => existingSelectionItem.segmentId === selectionItem.segmentId);
    if (existingItemIndex !== -1) {
      selection.splice(existingItemIndex, 1);
    }
  }
  public substractItemsFromSelection(selectionItems: MultiSegmentSelectionSelection) {
    // this.substractFromSelection(selectionItems, this._selection);
    this.candidatesToSelection(selectionItems, "substract");
  }
  public replaceSelectionWithItems(selectionItems: MultiSegmentSelectionSelection) {
    this.candidatesToSelection(selectionItems, "replace");
    // this.addItemToSelection(selectionItems);
  }
  private isAABBIntersect(boxA: AABB, boxB: AABB) {
    return boxA.minX <= boxB.maxX && boxA.maxX >= boxB.minX && boxA.minY <= boxB.maxY && boxA.maxY >= boxB.minY;
  }
  private updateSelectionCandidates() {
    for (const track of this.tracks.values()) {
      for (const segment of track.segments.values()) {
        const segmentAABB: AABB = {
          minX: segment.startWithBounds,
          maxX: segment.endWithBounds,
          minY: track.y,
          maxY: track.y + 1,
        };
        if (this.isAABBIntersect(this.getBoxSelectionAABB(), segmentAABB)) {
          this.addToSelection({ segmentId: segment.id }, this._selectionCandidates);
        } else {
          this.substractFromSelection({ segmentId: segment.id }, this._selectionCandidates);
        }
      }
    }
  }
  private candidatesToSelection(selectionCandidates: MultiSegmentSelectionSelection, operation: MultiSegmentSelectionMode) {
    switch (operation) {
      case "replace": {
        this.clearSelection();
        for (let i = 0; i < selectionCandidates.length; i++) {
          this.addToSelection(selectionCandidates[i], this._selection);
        }
        break;
      }
      case "add": {
        for (let i = 0; i < selectionCandidates.length; i++) {
          this.addToSelection(selectionCandidates[i], this._selection);
        }
        break;
      }
      case "substract": {
        for (let i = 0; i < selectionCandidates.length; i++) {
          this.substractFromSelection(selectionCandidates[i], this._selection);
        }
        break;
      }
    }
  }
  private getBoxSelectionAABB(): AABB {
    return {
      minX: Math.min(this.boxSelectionStartPoint.x, this._boxSelectionEndPoint.x),
      maxX: Math.max(this.boxSelectionStartPoint.x, this._boxSelectionEndPoint.x),
      minY: Math.min(this.boxSelectionStartPoint.y, this._boxSelectionEndPoint.y),
      maxY: Math.max(this.boxSelectionStartPoint.y, this._boxSelectionEndPoint.y),
    };
  }
  public startBoxSelection(boxSelectionStartPoint: Point, selectionMode: MultiSegmentSelectionMode) {
    this.selectionMode = selectionMode;
    this.isBoxSelectionStarted = true;
    this._selectionCandidates = [];
    this.boxSelectionStartPoint = boxSelectionStartPoint;
    this._boxSelectionEndPoint = { ...this.boxSelectionStartPoint };
  }
  public modifyBoxSelection(boxSelectionEndPoint: Point) {
    this._boxSelectionEndPoint = boxSelectionEndPoint;
    this.updateSelectionCandidates();
  }
  public endBoxSelection(boxSelectionEndPoint: Point) {
    if (!this.isBoxSelectionStarted) {
      return;
    }
    this.isBoxSelectionStarted = false;
    this.modifyBoxSelection(boxSelectionEndPoint);
    this.candidatesToSelection(this._selectionCandidates, this.selectionMode);
    this._selectionCandidates = [];
  }
  public clearSelection() {
    this._selection = [];
  }
  public isSelectionsEqual(selecitonA: MultiSegmentSelectionSelection, selectionB: MultiSegmentSelectionSelection): boolean {
    //INFO: should be remade if element order is imporante
    let result;
    if (selecitonA.length !== selectionB.length) {
      result = false;
    } else {
      result = selecitonA.every((selectionAItem) => selectionB.some((selectionBItem) => selectionBItem.segmentId === selectionAItem.segmentId));
    }
    return result;
  }
  public setSeleciton(selection: MultiSegmentSelectionSelection) {
    this._selection = structuredClone(selection);
  }
  public isInSelection(segmentId: UniqueId): boolean {
    return Boolean(this.selection.find((item) => item.segmentId === segmentId));
  }

  /**
   * @returns a rectangle in which all segments of the selection are inscribed. Do not confuse with getBoxSelectionAABB
   */
  private getSelectionAABB(): AABB {
    //TODO: update on add remove items.
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    if (this.selection.length === 0) {
      return {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
      };
    }
    for (const selectionItem of this.selection) {
      const segment = this.trackEditorApi.getInstance().getSegmentBySegmentId(selectionItem.segmentId); //TODO: optimize. Do not iterate. Save in memory also segments instances. Not just ids.
      minX = Math.min(minX, segment.startWithBounds);
      maxX = Math.max(maxX, segment.endWithBounds);

      minY = Math.min(minY, this.trackEditorApi.getInstance().getTrackByTrackId(this.trackEditorApi.getInstance().getTrackIdBySegmentId(segment.id)).y); //TODO: optimize
      maxY = Math.max(maxY, this.trackEditorApi.getInstance().getTrackByTrackId(this.trackEditorApi.getInstance().getTrackIdBySegmentId(segment.id)).y);
    }

    return {
      minX,
      maxX,
      minY,
      maxY,
    };
  }
  private getSelectionTransformation(): ObjectTransformation {
    const selectionAABB = this.getSelectionAABB();
    return new ObjectTransformation(selectionAABB.minX, selectionAABB.minY);
  }
  public getTransformations(): { selectionTransformation: ObjectTransformation; itemTransformations: Map<UniqueId, TransformationMatrix> } {
    const selectionTransformation = this.getSelectionTransformation();

    const map: Map<UniqueId, TransformationMatrix> = new Map();
    for (const item of this.selection) {
      const segment = this.trackEditorApi.getInstance().getSegmentBySegmentId(item.segmentId);
      const track = this.trackEditorApi.getInstance().getTrackByTrackId(this.trackEditorApi.getInstance().getTrackIdBySegmentId(segment.id));
      const segmentPoint: Point = selectionTransformation.worldToObject({ x: segment.startWithBounds, y: track.y });
      const segmentMatrix: TransformationMatrix = Transformation.formTransformationMatrix(segmentPoint.x, segmentPoint.y);
      map.set(item.segmentId, segmentMatrix);
    }
    return { selectionTransformation, itemTransformations: map };
  }
  public isNotEmpty(): boolean {
    return Boolean(this.selection.length);
  }
  public getSave(): MultiSegmentSelectionSave {
    const transformations = this.getTransformations();
    const save: MultiSegmentSelectionSave = {
      selectionTransformation: transformations.selectionTransformation,
      segmentSaves: [],
    };
    for (const item of this.selection) {
      const segmentTransformations = transformations.itemTransformations.get(item.segmentId);
      if (!segmentTransformations) {
        throw new Error();
      }
      save.segmentSaves.push({
        trackId: this.trackEditorApi.getInstance().getTrackIdBySegmentId(item.segmentId),
        segmentTransformations,
        segmentSave: SaveLoadManager.getSegmentSaveBySegment(this.trackEditorApi.getInstance().getSegmentBySegmentId(item.segmentId)),
      });
    }
    return save;
  }
  public getOptions(audioCursorOrigin: Point, multiSegmentSelectionSave: MultiSegmentSelectionSave): Array<{ trackId: UniqueId; segmentOptions: SegmentOptions }> {
    const selectionTransformation = multiSegmentSelectionSave.selectionTransformation.clone();
    selectionTransformation.moveTo(audioCursorOrigin);

    const options: Array<{ trackId: UniqueId; segmentOptions: SegmentOptions }> = [];
    for (const item of multiSegmentSelectionSave.segmentSaves) {
      const segmentOrigin = selectionTransformation.objectToWorld({ x: item.segmentTransformations[0][2], y: item.segmentTransformations[1][2] });
      const segmentOptions = SaveLoadManager.getSegmentOptionsBySegmentSave(item.segmentSave);
      options.push({
        trackId: item.trackId,
        segmentOptions: {
          ...segmentOptions,
          id: undefined,
          startPosition: segmentOrigin.x - (segmentOptions.segmentEditingTools?.editableBounds?.leftBoundPosition ?? 0),
        },
      });
    }
    return options;
  }
}
