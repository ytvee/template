<template>
  <div class="menu-item" @mouseover="menuItemOverHandler" @mouseleave="menuItemLeaveHandler">
    <div border-radius="5px" border-width="1px" class="">
      <div class="menu-item-content-wrapper">
        <slot name="menu-item-content"></slot>
      </div>
    </div>

    <div v-show="isMenuActive" class="sub-menu-wrapper">
      <SubMenu>
        <template #sub-menu-content>
          <slot name="sub-menu-content"></slot>
        </template>
      </SubMenu>
    </div>
  </div>
</template>

<script>
import SubMenu from "./MenuItem/SubMenu.vue";
export default {
  name: "MenuItem",
  components: {
    SubMenu,
  },
  data() {
    return {
      isMenuActive: false,
    };
  },
  methods: {
    menuItemOverHandler() {
      this.isMenuActive = true;
    },
    menuItemLeaveHandler() {
      this.isMenuActive = false;
    },
  },
};
</script>

<style scoped>
.menu-item {
  position: relative;
  cursor: pointer;
  user-select: none;
}
.menu-item-content-wrapper {
  height: 60px;

  border-radius: var(--small-border-radius);
}
.sub-menu-wrapper {
  position: absolute;
  top: 100%;
  cursor: auto;
  z-index: 100;
}
</style>
