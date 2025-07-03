<template>
  <div class="user-message">
    <!--    <div class="editing-button" @click="editMessage">-->
    <!--      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">-->
    <!--        <path d="M1.91211 8.5H2.62461L7.51211 3.6125L6.79961 2.9L1.91211 7.7875V8.5ZM1.41211 9.5C1.27044 9.5 1.15169 9.45208 1.05586 9.35625C0.960026 9.26042 0.912109 9.14167 0.912109 9V7.7875C0.912109 7.65417 0.937109 7.52708 0.987109 7.40625C1.03711 7.28542 1.10794 7.17917 1.19961 7.0875L7.51211 0.7875C7.61211 0.695833 7.72253 0.625 7.84336 0.575C7.96419 0.525 8.09128 0.5 8.22461 0.5C8.35794 0.5 8.48711 0.525 8.61211 0.575C8.73711 0.625 8.84544 0.7 8.93711 0.8L9.62461 1.5C9.72461 1.59167 9.79753 1.7 9.84336 1.825C9.88919 1.95 9.91211 2.075 9.91211 2.2C9.91211 2.33333 9.88919 2.46042 9.84336 2.58125C9.79753 2.70208 9.72461 2.8125 9.62461 2.9125L3.32461 9.2125C3.23294 9.30417 3.12669 9.375 3.00586 9.425C2.88503 9.475 2.75794 9.5 2.62461 9.5H1.41211ZM7.14961 3.2625L6.79961 2.9L7.51211 3.6125L7.14961 3.2625Z"-->
    <!--              fill="#C4C4C4"-->
    <!--        />-->
    <!--      </svg>-->
    <!--    </div>-->
    <div class="user-message-container" :style="{ padding: message.text.length > 90 ? '12px 50px' : '12px 16px' }">
      <div class="user-message-tag" :style="{ color: message.messageTag && tagColors[message.messageTag.toLowerCase()] }">
        {{ message.messageTag }}
      </div>
      <div v-if="message.messageTag" class="divider"></div>
      <div class="user-message-text">{{ message.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // todo: move to meta
      tagColors: {
        drums: "#F29E1D",
        bass: "#52BB4D",
        synth: "#0082E8",
        keys: "#9932D0",
        fx: "#0FD6CA",
      },
    };
  },
  methods: {
    editMessage() {
      console.log("Editing message:", this.$props.message);
    },
  },
};
</script>

<style scoped>
.user-message {
  display: flex;
  align-items: center;
  gap: var(--regular-2-block-gap);
}

/*.editing-button {*/
/*  width: 24px;*/
/*  height: 24px;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  border-radius: 50%;*/
/*  background: #FFFFFF0D;*/
/*  transition: all var(--default-transition);*/
/*}*/

/*.editing-button:hover {*/
/*  cursor: pointer;*/
/*  background-color: #52bb4d99;*/
/*  transition: all var(--default-transition);*/
/*}*/

.user-message-container {
  /*padding: 12px 16px;*/
  display: flex;
  /*flex-wrap: nowrap;*/
  /*white-space: nowrap;*/
  max-width: 700px;
  border-radius: 100px;
  box-sizing: border-box;
  color: var(--message-text-color);
  background-color: #00000033;
  user-select: text;

  font-family: var(--chat-font-family);
  font-size: var(--regular-font-size);
}

.divider {
  width: 5px;
}

.user-message-tag {
  font-weight: var(--largest-font-weight);
  text-transform: uppercase;
}

user-message-text {
  font-weight: var(--largest-font-weight);
}
</style>
