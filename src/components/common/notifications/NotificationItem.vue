<template>
  <div class="notification-item" :class="notification.notificationLevel">
    {{ notification.message }}
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  }
}
</script>

<style scoped>
  .notification-item {
    /* backdrop-filter: blur(24px); */
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: var(--regular-border-radius);
    
    padding: var(--default-padding);
  }
  .success {
    background-color: var(--color-success);
  }
  .info {
    background-color: rgba(0, 255,255);
  }
  .warn {
    background-color: var(--color-orange);
    ;
  }
  .error {
    background-color: var(--color-error);
  }
</style>