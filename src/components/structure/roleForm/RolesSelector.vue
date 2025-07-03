<template>
  <div class="roles-selector">
    <div v-for="role in roles" :key="role" class="role-item">
      <input :id="getInputId(role)" v-model="checkedList" type="checkbox" class="checkbox" name="selectRolesCheckBoxes" :value="role" />
      <label :for="getInputId(role)">{{ role }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "RolesSelector",
  props: {
    selectorId: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
  },
  emits: ["checked-list-updated"],

  data() {
    return {
      checkedList: [],
    };
  },
  watch: {
    checkedList() {
      this.$emit("checked-list-updated", this.checkedList);
    },
  },
  methods: {
    getInputId(role) {
      return this.$props.selectorId + "-" + role;
    },
  },
};
</script>

<style scoped>
h4 {
  margin-bottom: 25px;
  color: var(--color-gray);
}

label {
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  color: var(--color-gray);
  user-select: none;
  margin-bottom: unset;
}

input[type="checkbox"]:checked + label {
  color: var(--color-accent-primary);
}

.roles-selector {
  padding: 5px 0;
  max-height: 100%;
  overflow: auto;
}
.role-item {
  display: flex;
  align-items: center;
}
.role-item:not(:last-child) {
  margin-bottom: 25px;
}
</style>
