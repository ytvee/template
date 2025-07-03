<template>
  <div class="roles-holder">
    <RoleTag v-for="(tag, index) in rolesList" :key="index" :tag="tag" :not-moderate="notModerate" :is-active="roles.includes(tag)" />
  </div>
</template>

<script>
import RoleTag from "./RoleTag.vue";
import rolesList from "@/data/user/role/rolesList.json";

export default {
  name: "RolesList",
  components: {
    RoleTag,
  },
  props: {
    roles: {
      type: Array,
      required: true,
    },
    notModerate: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      rolesList: rolesList,
      active: false,
    };
  },
};
</script>

<style scoped>
h4 {
  margin-bottom: 15px;
}

.roles-holder {
  display: flex;
  flex-wrap: wrap;
  gap: var(--smallest-block-gap);
  /* overflow: auto; */
}
</style>
