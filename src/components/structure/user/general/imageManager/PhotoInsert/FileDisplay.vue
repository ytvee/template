<template>
  <div class="file-display">
    <div class="image-holder" @click="openInFullSize()">
      <img :src="obtainImgURL" :alt="obtainImgAlt" />
    </div>
    <div v-if="isRemoveable" class="remove-cross-wrapper" @click="fileRemoveButtonHandler">
      <SmallCloseCross />
    </div>
  </div>
</template>

<script>
import SmallCloseCross from "@/components/common/navigation/buttons/SmallCloseCross.vue";
import ImageInFullSizeModal from "../ImageInFullSizeModal.vue";
import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";

export default {
  name: "FileDisplay",
  components: {
    SmallCloseCross,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
    isRemoveable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["file-remove-event"],
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    imageInFullSizeModalProps() {
      return {
        displayedComponent: ImageInFullSizeModal,
        displayedComponentProps: {
          uri: this.obtainImgURL,
        },
      };
    },
    obtainImgURL() {
      return this.file.uri || window.URL.createObjectURL(this.file);
    },
    obtainImgAlt() {
      return this.file.alt || this.file.name;
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    fileRemoveButtonHandler() {
      this.$emit("file-remove-event");
    },
    openInFullSize() {
      this[modalActions.SET_MODAL](this.imageInFullSizeModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
  },
};
</script>

<style scoped>
.file-display {
  position: relative;
  flex-basis: calc((100% - var(--horizontal-space-between-files) * 3) / 4);
  aspect-ratio: 310/280;
  min-height: 110px;
  min-width: 121.7px;
  display: flex;
  flex-direction: column;

  border-radius: var(--small-border-radius);

  overflow: hidden;
  align-items: center;
  background: black;
}
.image-holder {
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.image-holder img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.remove-cross-wrapper {
  position: absolute;
  top: 0.9375rem;
  right: 0.9375rem;
}
</style>
