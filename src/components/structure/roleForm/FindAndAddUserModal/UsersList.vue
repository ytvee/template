<template>
  <div class="users-selector-holder">
    <div class="users-holder">
      <UsersListItem v-for="(user, index) in usersList" :key="index" :initial-user="user" :index="index" @change-user-event="changeUserEventHandler" />
    </div>
  </div>
</template>

<script>
import UsersListItem from "@/components/structure/roleForm/FindAndAddUserModal/UsersListItem.vue";

export default {
  name: "UsersList",
  components: {
    UsersListItem,
  },
  props: {
    users: {
      type: Object,
      required: true,
    },
  },
  emits: ["chosen-members"],
  data() {
    return {
      usersList: [],
    };
  },
  watch: {
    users: {
      handler(newUsers) {
        this.usersList = [...newUsers];
      },
      deep: true,
    },
    usersList: {
      handler(newUsersList) {
        const chosenUsers = newUsersList.filter((item) => {
          return item.isChosen === true;
        });
        this.$emit("chosen-members", chosenUsers);
      },
      deep: true,
    },
  },
  methods: {
    changeUserEventHandler(user, index) {
      this.usersList[index] = user;
    },
  },
};
</script>

<style scoped>
.users-selector-holder {
  margin-bottom: 10px;
}
.users-holder {
  padding-top: 5px;
  padding-right: var(--large-padding);
  max-height: 325px;
  overflow: auto;
}
</style>
