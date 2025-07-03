import { NavigationState } from "../navigation";

/**
 * Methods placed in this object act as a presenter between AudioEditor (our audio model) and vuex store submodule. In fact, they are handlers for events that the model (AudioEditor) can emit.
 * Do not put here internal functions or mutations or actions of store which AudioEditor model should not call directly.
 */
export const presenterMutations = {
  /* navigation */
  updateVisualCurrentTime(state: NavigationState, currentTime: number) {
    state.currentTime = currentTime;
    state.audioCursorCoordinates.x = currentTime;
  },
  setIsPlaying(state: NavigationState, isPlaying: boolean) {
    state.isPlaying = isPlaying;
  },
  /* /navigation */
};
export const presenterActions = {};
