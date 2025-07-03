import type { MaybeRef } from "vue";
import { useResizeObserver } from "@vueuse/core";

export function useResizeableCanvas(parentRef: MaybeRef<HTMLElement | null>, resizeHandler: (newCanvasWidth: number, newCanvasHeight: number) => void) {
  const resizeObserverCallback = (entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    resizeHandler(width, height);
  };

  useResizeObserver(parentRef, (entries) => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }
      resizeObserverCallback(entries[0]);
    });
  });
}
