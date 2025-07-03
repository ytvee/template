import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { getSnapGridStep } from "@/audioeditor/store/modules/submodules/trackeditor/navigation/navigationFunctions";
import { Point } from "@/audioeditor/visualmodel/types";
import store from "@/store/store";
import { useMoveMultiSegmentSelection } from "../../commandhistory/commands/concretecommands/movesegmenthelpers/useMoveMultiSegmentSelection";

type MovementDirection = "left" | "right" | "up" | "down";

function getMovementStep(direction: MovementDirection): Point {
  const movementStep: Point = {
    x: 0,
    y: 0,
  };

  switch (direction) {
    case "left": {
      movementStep.x = -getSnapGridStep(store.state.audioEditor.trackEditor.navigation);
      break;
    }
    case "right": {
      movementStep.x = getSnapGridStep(store.state.audioEditor.trackEditor.navigation);
      break;
    }
    case "up": {
      movementStep.y = -1;
      break;
    }
    case "down": {
      movementStep.y = 1;
      break;
    }
  }
  return movementStep;
}
export function moveMultiSegmentSelectionHelper(direction: MovementDirection) {
  const actionName = `move selection (${direction})`;
  if (!AudioEditor.getInstance().trackEditor.multiSegmentSelection.isNotEmpty()) {
    return {
      name: actionName,
      repeatStartCallback: () => {},
      endCallback: () => {},
    };
  }
  const movement: Point = {
    x: 0,
    y: 0,
  };
  const movementStep = getMovementStep(direction);

  const { startMove, move, endMove } = useMoveMultiSegmentSelection();
  function increaseMovementAndMove() {
    movement.x += movementStep.x;
    movement.y += movementStep.y;
    move(movement);
  }

  startMove();
  increaseMovementAndMove();

  function repeatStartCallback() {
    increaseMovementAndMove();
  }
  function endCallback() {
    endMove(movement);
  }
  return {
    name: actionName,
    repeatStartCallback,
    endCallback,
  };
}
