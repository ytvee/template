<template>
  <div class="quote-block">
    <div class="left-columm info">In reply</div>
    <div class="right-column">
      <div class="sender">{{ sender }}</div>
      <div class="ellipsis-helper">
        <!-- eslint-disable-next-line -->
        <div class="quote-content" v-html="quoteContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReplyToPostElement",
  props: {
    sender: {
      type: String,
      required: true,
    },
    quoteContent: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.quote-block {
  color: var(--color-gray);
  background-color: var(--color-dark);
  border: 1px solid var(--color-accent-primary);
  border-radius: var(--large-border-radius-2);
  padding: 1rem 1.5625rem;
  display: flex;
  width: 100%;
}

.left-columm {
  width: 10%;
  min-width: 70px;
  margin-right: 1.125rem;
}

.right-column {
  width: 90%;
  overflow: hidden;
}

.info {
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  text-decoration: underline;
}

.sender {
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  margin-bottom: 0.1875rem;
}
.ellipsis-helper {
  overflow: hidden;
  text-overflow: ellipsis;
  text-overflow: " ...";
  white-space: nowrap;
  font-size: 1.75rem;
  font-weight: var(--largest-font-weight);
  color: var(--color-accent-primary);
}
.quote-content {
  font-size: var(--forum-quote-content-font-size);
  font-weight: var(--regular-font-weight);
  display: inline;
}
.quote-content:deep(p) {
  color: var(--color-gray);
  display: inline;
}
</style>
