import { useEventListener } from "@vueuse/core";
import { ref, ShallowRef } from "vue";

type Callbacks = {
  dragoverHandler: () => any;
  dragendHandler: () => any;
  dropHandler: (files: Array<File>) => any;
  clickHandler: (files: Array<File>) => any;
};
type DragAndDropOptions = {
  isMultiple: boolean;
};
const DEFAULT_DRAG_AND_DROP_OPTIONS: DragAndDropOptions = {
  isMultiple: true,
};

/**
 * Non-recursive merge. Useful for options
 * @param partialT
 * @param defaultT
 * @returns
 */
function mergePartialWithDefault<T extends Object>(defaultT: T, partialT?: Partial<T>): T {
  if (partialT === undefined) {
    return new Object(defaultT) as T;
  }
  return Object.fromEntries(Object.entries(defaultT).map(([key, value]) => [key, partialT[key as keyof T] === undefined ? value : partialT[key as keyof T]])) as T;
}
function getFilesFromDragEvent(event: DragEvent): Array<File> {
  const files = [];
  if (event.dataTransfer?.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...event.dataTransfer.items].forEach((item) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        files.push(item.getAsFile());
      }
    });
  } else {
    if (!event.dataTransfer?.files) {
      throw new Error();
    }
    files.push(...event.dataTransfer.files);
  }
  return files;
}

export function useDragAndDrop(elementRef: ShallowRef<HTMLElement | null>, callbacks: Partial<Callbacks>, options: Partial<DragAndDropOptions>) {
  const completedOptions = mergePartialWithDefault(DEFAULT_DRAG_AND_DROP_OPTIONS, options);
  const isDragOver = ref(false);
  useEventListener(elementRef, "dragenter", (event) => {
    event.preventDefault();
    isDragOver.value = true;
  });
  useEventListener(elementRef, "dragover", (event) => {
    event.preventDefault();
    if (callbacks.dragoverHandler) {
      callbacks.dragoverHandler();
    }
  });
  useEventListener(elementRef, "dragleave", (event) => {
    event.preventDefault();
    isDragOver.value = false;
  });
  useEventListener(elementRef, "dragend", (event) => {
    event.preventDefault();
    isDragOver.value = false;
    if (callbacks.dragendHandler) {
      callbacks.dragendHandler();
    }
  });
  useEventListener(elementRef, "drop", (event) => {
    event.preventDefault();
    isDragOver.value = false;

    const files = getFilesFromDragEvent(event);

    if (callbacks.dropHandler) {
      callbacks.dropHandler(files);
    }
  });

  useEventListener(elementRef, "click", () => {
    const input = document.createElement("input");
    input.multiple = completedOptions.isMultiple;
    input.type = "file";
    const changeCallback = () => {
      // const file = input.files[0]; //TODO: make possible multiple files

      if (callbacks.clickHandler) {
        let files;
        if (files !== null) {
          files = input.files;
        } else {
          files = new FileList();
        }
        if (files === null) {
          throw new Error();
        }
        callbacks.clickHandler([...files]);
      }

      // this.emitFiles([...input.files]);
    };
    input.addEventListener("change", changeCallback);
    input.click();
  });

  return {
    isDragOver,
  };
}
