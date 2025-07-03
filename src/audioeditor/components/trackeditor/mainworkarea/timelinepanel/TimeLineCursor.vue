<template>
  <div ref="timeLineCursor" class="time-line-cursor" :style="{ transform: 'translateX(' + cursorClientPositionX + 'px)' }">
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.742009 0.94461L10.1156 0.944276C10.7385 0.944253 11.0874 2.09941 10.7026 2.88752L6.01588 12.4855C5.71702 13.0975 5.14084 13.0975 4.84195 12.4855L0.155072 2.88789C-0.229785 2.0998 0.119115 0.944633 0.742009 0.94461Z" fill="white" />
    </svg>
  </div>
</template>

<script>
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { useTemplateRef } from "vue";
import { useMapState, useMapMutations } from "@/audioeditor/composable/utils/useStoreMaps";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
export default {
  name: "TimeLineCursor",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { navigationModel } = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
      navigationModel: (state) => state,
    });
    const storeMutationsNavigation = useMapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setAudioCursorCoordinates"]);

    const startAudioCursorCoordinates = { x: 0, y: 0 };
    const dragCallback = (event, pointerX, pointerY, movementX, movementY, pointerdownEvent, movementXFromStart, movementYFromStart) => {
      switch (pointerdownEvent.button) {
        case 0: {
          storeMutationsNavigation.setAudioCursorCoordinates({
            startAudioCursorCoordinates,
            movementXFromStart,
            movementYFromStart,
          });
          break;
        }
        case 1: {
          break;
        }
        case 2: {
          break;
        }
      }
    };
    const startDragCallback = (event) => {
      switch (event.button) {
        case 0: {
          Object.assign(startAudioCursorCoordinates, navigationModel.value.audioCursorCoordinates);
          break;
        }
        case 1: {
          break;
        }
        case 2: {
          break;
        }
      }
    };

    useClickAndDrag(useTemplateRef("timeLineCursor"), { dragCallback, startDragCallback }, { separateClickAndDrag: false });
  },
  computed: {
    cursorClientPositionX() {
      return Transformation.worldToViewport({ x: this.$props.navigationModel.audioCursorCoordinates.x, y: 0 }, this.$props.navigationModel).x;
    },
  },
};
</script>

<style scoped>
.time-line-cursor {
  position: absolute;
  left: -5px;
  bottom: 0;
  pointer-events: auto;
  cursor: pointer;
  display: flex;
}
</style>
