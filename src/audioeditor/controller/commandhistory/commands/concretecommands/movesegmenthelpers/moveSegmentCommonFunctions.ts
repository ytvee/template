import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { snapToGrid } from "@/audioeditor/store/modules/submodules/trackeditor/navigation/navigationFunctions";
import { ObjectTransformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { Point } from "@/audioeditor/visualmodel/types";
import store from "@/store/store";

function applyBorders(objectTransformation: ObjectTransformation) {
  const objectOrigin = objectTransformation.getOrigin();
  if (objectOrigin.x < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
    objectTransformation.moveTo({ x: AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder, y: objectOrigin.y });
  }
}
function snapToTrackGrid(yToSnap: number) {
  return Math.round(yToSnap);
}
function applyGrid(objectTransformation: ObjectTransformation) {
  const objectOrigin = objectTransformation.getOrigin();

  objectOrigin.x = snapToGrid(objectOrigin.x, store.state.audioEditor.trackEditor.navigation);
  objectOrigin.y = snapToTrackGrid(objectOrigin.y);

  objectTransformation.moveTo(objectOrigin);
}
export function moveObject(objectTransformation: ObjectTransformation, movement: Point) {
  objectTransformation.move(movement.x, movement.y);

  applyBorders(objectTransformation);
  applyGrid(objectTransformation);
}
