<template>
  <div class="user-plag-holder">
    <div class="user-avatar-holder">
      <RoundAvatar class="user-avatar" :avatar-src="user?.pictureURI" />
    </div>
    <div :title="user.username" class="username">{{ user.name }}</div>
    <div v-if="hasUserConfirmedTags" class="role-tag-wrapper">
      <RoleTag v-for="(role, index) in user.tags.confirmed" :key="index" :tag="role" :is-button="false" class="role-tag-item" />
    </div>
  </div>
</template>

<script>
import RoundAvatar from "@/components/common/user/RoundAvatar.vue";
import RoleTag from "@/components/structure/roleForm/acceptPerson/RoleTag.vue";

export default {
  name: "UserPlag",
  components: {
    RoundAvatar,
    RoleTag,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasUserConfirmedTags() {
      return this.user.tags ? true : false;
    },
  },
};
</script>

<style scoped>
.user-plag-holder {
  display: flex;
  align-items: center;
  max-height: 50px;
  width: 100%;
  height: 50px;
  position: relative;
}

.user-avatar-holder {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--very-large-font-size);
  color: var(--color-light);
}

.role-tag-wrapper {
  padding: 5px;
  display: flex;
  width: 180px;
  gap: var(--regular-block-gap);
  overflow-x: auto;
}
</style>
