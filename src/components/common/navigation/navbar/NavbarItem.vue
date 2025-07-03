<template>
  <div class="nav-button-wrapper">
    <div :class="['nav-button', {selected: isActive}]">
      <img :src="iconPath" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    iconPath: {
      type: String,
      required: true,
      default: "",
    },
  },
  data() {
    return {
      // isActive: false,
    };
  },
  computed: {},
  methods: {
    isItemSelected() {},
  },
};
</script>

<style scoped>
.nav-button-wrapper {
  /* padding: 2px; */
  width: 100%;
  user-select: none;
}

.nav-button-wrapper:first-child {
  padding: 4px 4px 2px 4px;
}

.nav-button-wrapper {
  padding: 2px 4px;
}

.nav-button-wrapper:last-child {
  padding: 2px 4px 4px 4px;
}

.nav-button-wrapper:hover {
  cursor: pointer;
}

.nav-button-wrapper img {
  opacity: 0.6;
  transition: opacity var(--default-transition);
}

.nav-button-wrapper:hover img,
.nav-button.selected img {
  opacity: 1;
  transition: opacity var(--default-transition);
}

.nav-button {
  width: 36px;
  height: 36px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-raduis-circle);
  transition: background var(--default-transition);
}

.nav-button.selected {
  background: var(--transparent-light-15);
  transition: background var(--default-transition);
}

</style>
