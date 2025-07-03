import { useEventListener } from "@vueuse/core";
import type { ShallowRef } from "vue";

type UseClickAndDragCallbacks = {
  startDragCallback: (event: PointerEvent, pointerX: number, pointerY: number) => void;
  dragCallback: (event: PointerEvent, pointerX: number, pointerY: number, movementX: number, movementY: number, pointerdownEvent: PointerEvent, movementXFromStart: number, movementYFromStart: number) => void;
  endDragCallback: (event: PointerEvent, pointerX: number, pointerY: number, pointerdownEvent: PointerEvent, movementXFromStart: number, movementYFromStart: number) => void;
  clickCallback: (event: PointerEvent, pointerX: number, pointerY: number) => void;
};

type UseClickAndDragOptions = {
  /**
   * true: If the move did not occur, then only clickCallback will be executed. dragCallback startDragCallback endDragCallback will not be executed. If move occured only dragCallback startDragCallback endDragCallback will be executed. clickCallback will not be executed.
   * false: dragCallback startDragCallback endDragCallback allways will be executed. clickCallback only will be executed if no move occures.
   */
  separateClickAndDrag: boolean; //INFO: if true click and drug will be separated so if user only clicks but not drags only clickCallback will be executed;
  // button: number;
};

export function useClickAndDrag(elementRef: ShallowRef<HTMLElement | null>, callbacks: Partial<UseClickAndDragCallbacks>, options?: Partial<UseClickAndDragOptions>) {
  let unlistenPointerMove: (() => void) | null = null;
  let unlistenPointerUp: (() => void) | null = null;
  let isListeningMove = false; //INFO: prevents accidental duplication when pointerup do not emitted but pointer was up and down in fact (examples: context menu call and tab context menu call during dragging)
  let isMoved = false; //INFO: part of implementation for separateClickAndDrag
  let isSubsequentMove = false; //INFO: if not the first move event

  let pointerdownEvent: PointerEvent | null = null;

  let oldClientX: number;
  let oldClientY: number;
  let startDragButton: number; //INFO: event.button field is incorrect in move events. So save its value from pointerdown event

  const pointerUpCallback = (event: PointerEvent) => {
    isListeningMove = false;

    if (callbacks.clickCallback && !isMoved) {
      if (pointerdownEvent === null) {
        throw new Error();
      }
      callbacks.clickCallback(pointerdownEvent, event.x, event.y);
    }
    if (callbacks.endDragCallback && (!options?.separateClickAndDrag || (options?.separateClickAndDrag && isMoved))) {
      if (!pointerdownEvent) {
        throw new Error();
      }
      callbacks.endDragCallback(event, event.x, event.y, pointerdownEvent, event.x - pointerdownEvent.x, event.y - pointerdownEvent.y);
    }
    if (unlistenPointerMove) {
      unlistenPointerMove();
    }
    if (unlistenPointerUp) {
      unlistenPointerUp();
    }
  };

  useEventListener(elementRef, "pointerdown", (event: PointerEvent) => {
    if (isListeningMove) {
      return;
    }
    isListeningMove = true;
    isMoved = false;
    isSubsequentMove = false;

    pointerdownEvent = event;

    oldClientX = event.clientX;
    oldClientY = event.clientY;
    startDragButton = event.button;

    if (callbacks.startDragCallback && !options?.separateClickAndDrag) {
      callbacks.startDragCallback(event, event.x, event.y);
    }
    unlistenPointerMove = useEventListener(document, "pointermove", (event: PointerEvent) => {
      isMoved = true;

      if (!isSubsequentMove) {
        if (callbacks.startDragCallback && options?.separateClickAndDrag) {
          if (pointerdownEvent === null) {
            throw new Error();
          }
          callbacks.startDragCallback(pointerdownEvent, pointerdownEvent.x, pointerdownEvent.y);
        }
        isSubsequentMove = true;
      }
      const offsetX = event.clientX - oldClientX;
      const offsetY = event.clientY - oldClientY;
      if (!pointerdownEvent) {
        throw new Error();
      }
      if (callbacks.dragCallback) {
        callbacks.dragCallback(event, event.x, event.y, offsetX, offsetY, pointerdownEvent, event.x - pointerdownEvent.x, event.y - pointerdownEvent.y);
      }
      oldClientX = event.clientX;
      oldClientY = event.clientY;
    });

    unlistenPointerUp = useEventListener(document, "pointerup", pointerUpCallback);
  });
}
