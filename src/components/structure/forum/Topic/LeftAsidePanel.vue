<template>
  <aside class="left-aside-panel">
    <div class="top-buttons-holder">
      <router-link :to="{ path: `/artist/${$props.artistId}/forum` }">
        <button class="outlined button-with-svg" title="Go to topics">
          <svg width="14" height="23" viewBox="0 0 14 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1.5L3 11.5L12 21.5" stroke="url(#paint0_linear_4745_5914)" stroke-width="3" stroke-linecap="round" />
            <defs>
              <linearGradient id="paint0_linear_4745_5914" x1="12.3" y1="-0.357143" x2="3.89225" y2="21.6408" gradientUnits="userSpaceOnUse">
                <stop stop-color="#74DE6F" />
                <stop offset="0.859375" stop-color="#CDE768" />
              </linearGradient>
            </defs>
          </svg>
          <div>Go to topics</div>
        </button>
      </router-link>
    </div>
    <div class="bottom-buttons-holder">
      <button v-if="answerPostId" class="outlined button-with-svg" @click="transitToAnswerButtonHandler">
        <svg width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 2L15 13L2 2" stroke="url(#paint0_linear_4746_6140)" stroke-width="3" stroke-linecap="round" />
          <defs>
            <linearGradient id="paint0_linear_4746_6140" x1="30.4143" y1="1.63333" x2="2.28771" y2="13.0676" gradientUnits="userSpaceOnUse">
              <stop stop-color="#74DE6F" />
              <stop offset="0.859375" stop-color="#CDE768" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: "LeftAsidePanel",
  props: {
    artistId: {
      type: Number,
      required: true,
    },
    answerPostId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  emits: ["transit-to-answer"],
  methods: {
    goToTopicsButtonHandler() {
      this.$router.push({ path: "/artist/" + this.$props.artistId + "/forum" });
    },
    transitToAnswerButtonHandler() {
      this.$emit("transit-to-answer");
    },
  },
};
</script>

<style scoped>
.left-aside-panel {
  width: calc((100vw - var(--content-width)) / 2);
}
.top-buttons-holder {
  position: -webkit-sticky;
  position: sticky;
  padding: 5px;
  top: calc(var(--navbar-height) + var(--top-buttons-holder-top-shift));
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.top-buttons-holder a {
  text-decoration: none;
}

.bottom-buttons-holder {
  position: -webkit-sticky;
  position: sticky;
  padding: 5px;
  top: calc(100vh - 235px);
  overflow: hidden;
}
.bottom-buttons-holder > * {
  margin: 0 25px 0 auto;
  max-width: 100%;
}

.button-with-svg {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-with-svg * {
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-with-svg svg {
  flex-shrink: 0;
}
</style>
