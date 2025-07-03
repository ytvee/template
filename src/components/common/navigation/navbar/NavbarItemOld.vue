<template>
  <div v-if="isItemVisible && isTabVisible()" class="navbar-item" tabindex="0" @mouseenter="isDropdownShown = true" @mouseleave="isDropdownShown = false">
    <p v-if="!isCategoryUrlPresent" class="navbar-item-text disabled" :class="{ viewing: isDropdownShown }">
      {{ category.categoryName }}
    </p>
    <p v-else class="navbar-item-text" :class="{ viewing: isDropdownShown }">
      <router-link :to="category.categoryUrl">
        {{ category.categoryName }}
      </router-link>
    </p>
    <div v-if="!isCategoryUrlPresent" v-show="isDropdownShown" class="navbar-item-dropdown-holder">
      <div class="navbar-item-dropdown">
        <div v-for="(item, index) in category.items" :key="index" class="navbar-item-dropdown-row">
          <div class="navbar-item-dropdown-row-image">
            <img :src="item.imgsrc" alt="not found" />
          </div>
          <div class="navbar-item-dropdown-row-content">
            <div class="item-title">
              <h4>
                {{ item.title }}
              </h4>
            </div>
            <div class="item-description">
              <p>
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import userGetters from "@/data/store/user/userGetters.json";
import storeModules from "@/data/store/storeModules.json";

export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
    isItemVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isDropdownShown: false,
    };
  },
  computed: {
    ...mapGetters(storeModules.USER, [userGetters.GET_CURRENT_USER_ROLES]),
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
    isCategoryUrlPresent() {
      return this.category.categoryUrl !== "";
    },
  },
  methods: {
    isTabVisible() {
      const rolesWithAccessArray = Array.from(this.category.rolesWithAccess);
      const userRolesArray = this[userGetters.GET_CURRENT_USER_ROLES] ? this[userGetters.GET_CURRENT_USER_ROLES] : []; //for avoid error on unmounted
      let isVisible = false;
      userRolesArray.forEach((item) => {
        isVisible = isVisible || rolesWithAccessArray.includes(item);
      });
      return isVisible;
    },
  },
};
</script>

<style scoped>
.navbar-item {
  margin-right: 40px;
  position: relative;
}

.navbar-item-text {
  user-select: none;
  cursor: default;
  font-size: var(--medium-font-size-2);
  font-weight: var(--medium-font-weight);
  color: var(--color-light);
  cursor: pointer;
}

.navbar-item-text a {
  text-decoration: none;
  color: var(--color-light);
}

.navbar-item-text:hover,
.navbar-item-text a:hover,
.viewing {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent;
  background: var(--gradient-primary);
}

.navbar-item-dropdown-holder {
  max-width: 300px;
  width: max-content;
  position: absolute;
  background: transparent;
  padding-top: calc(var(--navbar-height) / 2);
  top: 50%;
  right: 0;
}

.navbar-item-dropdown {
  box-shadow: var(--shadow-accent);
  border-radius: 0 0 20px 20px;
  padding: 20px 0;
  background: var(--color-dark);
  box-shadow: var(--shadow-accent);
}

.navbar-item-dropdown-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  user-select: none;
  color: var(--color-light);
  padding: 5px 20px;
}

.navbar-item-dropdown-row:hover {
  cursor: pointer;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-item-dropdown-row-image {
  margin-right: 20px;
  width: var(--navbar-dropdown-item-icon-width);
  flex-shrink: 0;
}

.navbar-item-dropdown-row-image img {
  width: 100%;
  object-fit: cover;
}

.navbar-item-dropdown-row-content {
  flex: 1 0 210px;
}

.item-description {
  font-size: var(--regular-font-size);
}

.item-title {
  margin-bottom: 6px;
}
</style>
