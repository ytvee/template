<template>
  <div class="drug-and-drop-dummy" :style="{ transform: 'translateX(' + dummyX + 'px)' }">Drag and drop segment</div>
</template>

<script>
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
export default {
  name: "DrugAndDropDummy",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dummyX() {
      return Transformation.worldToViewport({ x: this.$props.navigationModel.cursorCoordinates.x, y: 0 }, this.$props.navigationModel).x;
    },
  },
};
</script>

<style scoped>
.drug-and-drop-dummy {
  width: 100px;
  height: 100%;

  border-radius: var(--audio-editor-default-border-radius);
  border: 2px dashed rgba(75, 74, 74, 0.47);
  background: rgba(103, 103, 103, 0.1);

  padding: var(--large-padding);
  display: flex;

  align-items: center;
  justify-content: center;

  color: var(--audio-editor-color-translucent-white-4);

  text-align: center;
  pointer-events: none;
}
</style>
