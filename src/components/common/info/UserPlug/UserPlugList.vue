<template>
  <div v-for="user in userList" :key="user.id" class="user-plag-list-holder">
    <UserPlug class="user-plag-item" :user="user" />
  </div>
</template>

<script>
import UserPlug from "./UserPlug.vue";

export default {
  name: "UserPlugList",
  components: {
    UserPlug,
  },
  props: {
    userList: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.user-plag-item {
  margin-bottom: 20px;
}
</style>
