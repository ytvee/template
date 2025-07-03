<template>
  <span class="forum-tag">
    {{ tagName }}
  </span>
</template>

<script>
export default {
  name: "ForumTag",
  props: {
    tagName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.forum-tag {
  padding: 2px 15px;
  border-radius: var(--small-border-radius);
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  background: var(--gradient-card-dark);
  color: var(--color-dark);
  overflow-wrap: normal;
}
</style>
