<template>
  <div class="work-area-keyboard">
    work area keyboard
    <PianoKeyBoard />
  </div>
</template>

<script>
import PianoKeyBoard from "@/components/midieditor/common/PianoKeyBoard.vue";
export default {
  name: "WorkAreaKeyBoard",
  components: {
    PianoKeyBoard,
  },
};
</script>
