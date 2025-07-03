<template>
  <div class="add-role-modal">
    <div class="add-role-modal-header">
      <h2>Add roles</h2>
      <CloseModalButton />
    </div>
    <RolesSelector class="roles-selector" :selector-title="titleRolesSelector" :roles="rolesList" />
    <div class="add-role-button-wrapper">
      <div class="button medium add-role-button disabled">Add</div>
    </div>
  </div>
</template>

<script>
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import RolesSelector from "../../roleForm/RolesSelector.vue";
import rolesList from "@/data/user/role/rolesList.json";

export default {
  name: "AddRoleModal",
  components: { CloseModalButton, RolesSelector },
  data() {
    return {
      titleRolesSelector: "Choose user's role",
      rolesList,
    };
  },
};
</script>

<style scoped>
.add-role-modal {
  width: 500px;
  background: var(--color-dark);
  padding: 50px 60px 50px;
  border-radius: var(--medium-border-radius);
}
.add-role-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.roles-selector {
  margin-bottom: 30px;
}
.add-role-button-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
