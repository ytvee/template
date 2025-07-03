<template>
  <div class="tab-wrapper" @click="$emit('click')">
    <div class="tab" :class="{ active: isActive }">
      <span>{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
    label: String,
  },
};
</script>

<style scoped>
.tab-wrapper {
  width: 79px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 1;
}

.tab-wrapper:hover {
  cursor: pointer;
}

.tab {
  min-height: 17px;
  display: flex;
  align-items: center;
}

.tab span {
  height: 17px;
  font-family: "Wix Madefor Text", sans-serif;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  color: var(--transparent-light-40);
  transition: color 0.3s ease;
}

/*
.tab-wrapper:hover span,
*/
.tab.active span {
  color: var(--color-light);
}
</style>