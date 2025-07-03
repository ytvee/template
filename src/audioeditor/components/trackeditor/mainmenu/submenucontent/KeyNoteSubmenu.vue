<template>
  <div class="key-note-submenu">
    <div class="buttons-holder">
      <SubMenuBorderedButton v-for="button in keyNoteButtons" :key="button.name" class="bordered-button" :content="button.value" usage-case="KEY_NOTE_SUB_MENU" :current-note="currentNote" :is-selected="isSelectedHandler(button.name)" @click="chooseNoteButtonHandler(button.name)" />
      <div class="place-holder"></div>
    </div>
  </div>
</template>

<script>
import SubMenuBorderedButton from "./submenucontentbutton/SubMenuBorderedButton.vue";
export default {
  name: "KeyNoteSubmenu",
  components: {
    SubMenuBorderedButton,
  },
  data() {
    return {
      currentNote: "",
      keyNoteButtons: [
        { name: "c", value: "C" },
        { name: "c#", value: "C#" },
        { name: "d", value: "D" },
        { name: "d#", value: "D#" },
        { name: "e", value: "E" },
        { name: "f", value: "F" },
        { name: "g", value: "G" },
        { name: "g#", value: "G#" },
        { name: "a", value: "A" },
        { name: "a#", value: "A#" },
        { name: "b", value: "B" },
      ],
    };
  },
  methods: {
    chooseNoteButtonHandler(format) {
      this.currentNote = format;
    },
    isSelectedHandler(name) {
      return name === this.currentNote ? true : false;
    },
  },
};
</script>

<style scoped>
.buttons-holder {
  /* display: grid;
    grid-template-columns: repeat(3, auto);
    grid-column-gap: var(--regular-block-gap);
    grid-row-gap: var(--regular-block-gap);
    width: 150px; */
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  row-gap: var(--smallest-block-gap);
  align-items: center;
}
.bordered-button {
  display: flex;
  justify-content: center;
  padding: 0 13px;
  cursor: pointer;
}
.place-holder {
  width: 37px;
}
</style>
