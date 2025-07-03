<template>
  <div class="notifications">
    <TransitionGroup>
      <NotificationItem v-for="(notification, index) in notifications" :key="notification.id" :notification="notification" />    
    </TransitionGroup>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import NotificationItem from "./NotificationItem.vue";
export default {
  components: {
    NotificationItem
  },
  computed: {
    ...mapState('localNotifications', {
      notifications: state => state.notifications,
    })
  },
  mounted() {
    console.log(this.notifications)
  }
}
</script>

<style scoped>
.notifications {
  position: absolute;
  z-index: 500;
  left: 0;
  bottom: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity var(--default-transition);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
