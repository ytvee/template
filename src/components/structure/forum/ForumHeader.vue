<template>
  <div class="forum-header">
    <div class="column-filters">Filter</div>
    <div class="column-primary">Topic</div>
    <div class="column-secondary">Replies</div>
    <div class="column-secondary">Views</div>
    <div class="column-secondary">Activity</div>
  </div>
</template>

<script>
export default {
  name: "ForumHeader",
};
</script>

<style scoped>
.forum-header {
  display: flex;
  gap: var(--regular-block-gap);
  padding: 1.25rem 1rem;
  border-bottom: 3px solid;
  border-image: var(--gradient-card-dark) 1;
}
</style>
