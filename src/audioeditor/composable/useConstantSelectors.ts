/**
 * here we place selectors which are used to select DOM element via js code
 */
export function useConstantSelectors() {
  return {
    AUDIO_SEGMENT: "audio-segment",
    AUDIO_SEGMENT_EDITABLE_BOUNDS_HANDLE: "editable-bounds-handle",
    AUDIO_SEGMENT_HANDLE_LEFT: "handle-left",
    AUDIO_SEGMENT_HANDLE_RIGHT: "handle-right",

    WORKAREA_TOOLTIP: "workarea-tooltip",

    RECORD_TIME_RANGE_TOOLTIP: "tooltip",
  };
}
