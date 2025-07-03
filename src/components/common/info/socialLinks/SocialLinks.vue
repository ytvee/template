<template>
  <div class="user-links">
    <div v-for="(link, index) in userLinks" :key="index" class="user-link">
      <a :href="link.url">
        <img :src="getLinkIcon(link)" :alt="link.name" />
      </a>
    </div>
  </div>
</template>

<script>
// import { BASE_ICONS_URI, LINK_ICONS } from "@/data/common/iconsData.json";
import ICONS_DATA from "@/data/common/iconsData.json";

export default {
  name: "SocialLinks",
  props: {
    userLinks: {
      type: Array,
      default: () => [],
    },
    isModal: Boolean,
  },
  methods: {
    getLinkIcon(item) {
      return ICONS_DATA.BASE_ICONS_URI + ICONS_DATA.LINK_ICONS[item.name].iconUrl;
    },
  },
};
</script>

<style scoped>
.user-links {
  height: 40px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.user-link {
  transition: var(--default-transition);
  cursor: pointer;
}
.user-link:hover {
  transition: var(--default-transition);
  transform: scale(1.15);
}

.user-link:last-child {
  margin-right: 0;
}

.user-link a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.user-link img {
  object-fit: cover;
  width: 100%;
}

.user-link a:hover path {
  fill: var(--color-accent-primary);
}
</style>
