<template>
  <div class="reply-to-post-info-holder">
    <div class="reply-to-summary-holder" @click="replyToSummaryClickHandler">
      <!-- eslint-disable vue/no-v-html -->
      <div class="reply-to-post-quote-title">
        <h4>{{ currentPostToBeReplied.replyUser }}</h4>
      </div>
      <div class="reply-to-post-summary" v-html="currentPostToBeReplied.replyCookedContent" />
      <!-- eslint-enable vue/no-v-html -->
      <!-- <h3 v-show="!isWithCookedQuote">{{ topicName }}</h3> -->
    </div>
    <div v-if="isPostToBeRepliedQuoteRemovable" class="svg-button accent" @click="removeReplyButtonHandler">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0857 10L20 17.9143V20H17.9143L10 12.0857L2.08571 20H0V17.9143L7.91429 10L0 2.08571V0H2.08571L10 7.91429L17.9143 0H20V2.08571L12.0857 10Z" fill="url(#paint0_linear_4717_9543)" />
        <defs>
          <linearGradient id="paint0_linear_4717_9543" x1="-1.85714" y1="-0.666668" x2="22.63" y2="3.54493" gradientUnits="userSpaceOnUse">
            <stop stop-color="#74DE6F" />
            <stop offset="0.859375" stop-color="#CDE768" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostToBeRepliedSummaryBlock",
  props: {
    currentPostToBeReplied: {
      type: Object,
      required: true,
    },
    isPostToBeRepliedQuoteRemovable: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["reply-to-summary-click", "remove-reply-button-click"],
  methods: {
    replyToSummaryClickHandler() {
      this.$emit("reply-to-summary-click");
    },
    removeReplyButtonHandler() {
      this.$emit("remove-reply-button-click");
    },
  },
};
</script>
<style scoped>
.reply-to-post-info-holder {
  display: flex;
  justify-content: space-between;
}

.reply-to-summary-holder {
  flex-grow: 1;
  margin-bottom: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.reply-to-post-quote-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-gray);
  font-size: var(--medium-font-size-2);
  font-weight: var(--h4-font-weight);
}
.reply-to-post-summary {
  color: var(--color-gray);
  font-size: var(--forum-post-content-font-size);
  font-weight: var(--regular-font-weight);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
