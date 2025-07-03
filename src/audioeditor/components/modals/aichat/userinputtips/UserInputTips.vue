<template>
  <div v-for="(tip, index) in filteredTips" :key="index" class="user-input-tip" @click="addTipToMessageHandle(tip)">
          <span v-if="index < 3">
            <span class="highlighted-part">{{ getHighlightedPart(tip, inputMessage) }}</span>
            <span class="remaining-part">{{ getRemainingPart(tip, inputMessage) }}</span>
          </span>
    <hr v-if="index < filteredTips.length - 1" />
  </div>
</template>

<script>
import DefaultInputSelect from "@audioeditor/components/modals/aichat/defaultinputselect/DefaultInputSelect.vue";
import SwitchPanel from "@audioeditor/components/modals/aichat/switch/SwitchPanel.vue";
import LargeInputSelect from "@audioeditor/components/modals/aichat/largeinputselect/LargeInputSelect.vue";
import chatTips from "@/data/aichat/chatTips.json";

export default {
  components: { DefaultInputSelect, SwitchPanel, LargeInputSelect },
  emits: ['addTipToMessage'],
  computed: {
    filteredTips() {
      return chatTips.baseTips.filter((tip) => {
        return !(this.inputMessage === tip) && tip.toLowerCase().startsWith(this.inputMessage.toLowerCase());
      });
    },
  },
  props: {
    isSupportButtonsShowed: {
      type: Boolean,
      required: false,
      default: false,
    },
    isFullPage: {
      type: Boolean,
      required: false,
      default: false,
    },
    inputMessage: {
      type: String,
      required: true,
    },

  },
  data() {
    return {
      messageTag: "",
      messageTips: ["Generate a track for me", "Make it more punchy", "Make it longer"],
    };
  },
  methods: {
    addTipToMessageHandle(tip) {
      this.$emit("addTipToMessage", tip);
    },
    getHighlightedPart(tip, input) {
      if (!input) return "";
      const index = tip.toLowerCase().indexOf(input.toLowerCase());
      return index >= 0 ? tip.substring(0, index + input.length) : "";
    },
    getRemainingPart(tip, input) {
      if (!input) return tip;
      const index = tip.toLowerCase().indexOf(input.toLowerCase());
      return index >= 0 ? tip.substring(index + input.length) : tip;
    },
  },
};
</script>

<style scoped>
.user-input-tip {
  width: 730px;
  display: flex;
  flex-direction: column;
}

.user-input-tip span {
  padding-left: 1px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 6px;

  font-family: "Wix Madefor Text";
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-decoration: underline;
  text-decoration-style: solid;
}

.user-input-tip:hover,
.user-input-tip:hover span {
  cursor: pointer;
  text-decoration-color: white;
}

.user-input-tip:hover,
.user-input-tip hr {
  border-top: none;
}

.user-input-tip hr {
  border: none;
  border-top: 1px solid grey;
}

.highlighted-part {
  color: white;
}

.remaining-part {
  color: gray;
}
</style>
