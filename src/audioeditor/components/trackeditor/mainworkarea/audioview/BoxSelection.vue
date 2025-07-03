<template>
  <div v-if="visualMultiSegmentSelection.isBoxSelectionActive" class="box-selection">
    <!-- box-selection -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
export default {
  data() {
    return {
      AUDIO_EDITOR_CONFIGURATION,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, {
      visualMultiSegmentSelection: (state) => state.visualMultiSegmentSelection,
    }),
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
      navigationState: (state) => state,
    }),
    startPoint() {
      const point = Transformation.worldToViewport(this.visualMultiSegmentSelection.boxSelectionStartPoint, this.navigationState);
      return point;
    },
    endPoint() {
      const point = Transformation.worldToViewport(this.visualMultiSegmentSelection.boxSelectionEndPoint, this.navigationState);
      return point;
    },
    top() {
      return Math.min(this.startPoint.y, this.endPoint.y);
    },
    left() {
      return Math.min(this.startPoint.x, this.endPoint.x);
    },
    width() {
      return Math.max(this.endPoint.x, this.startPoint.x) - this.left + "px";
    },
    height() {
      return Math.max(this.endPoint.y, this.startPoint.y) - this.top + "px";
    },
    getSelectionColor() {
      switch (this.visualMultiSegmentSelection.selectionMode) {
        case "replace": {
          return AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.selectionReplaceColor;
        }
        case "add": {
          return AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.selectionAddColor;
        }
        case "substract": {
          return AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.selectionSubstractColor;
        }
        default: {
          throw new Error();
        }
      }
    },
    getSelectionBackground() {
      return this.getSelectionColor + AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.selectionOpacity;
    },
  },
};
</script>

<style scoped>
.box-selection {
  position: absolute;
  transform: translate(v-bind("left + 'px'"), v-bind("top + 'px'"));
  width: v-bind("width");
  height: v-bind("height");
  background: v-bind("getSelectionBackground");
  border: 1px solid v-bind("getSelectionColor");
}
</style>
