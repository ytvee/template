<template>
  <div class="user-links-wrapper">
    <a v-for="(link, index) in userLinks" :key="index" class="user-link" :href="link.url">
      <img :src="link.linkIcon" :alt="link.name" />
      <div class="user-link-url">{{ link.url }}</div>
    </a>
  </div>
</template>

<script>
// import { BASE_ICONS_URI, LINK_ICONS } from "@/data/common/iconsData.json";
import ICONS_DATA from "@/data/common/iconsData.json";

export default {
  name: "SocialLinksList",
  props: {
    userLinks: {
      type: Array,
      default: () => [],
    },
    isModal: Boolean,
  },
  data() {
    return {
      links: [],
    };
  },
  watch: {
    userLinks: {
      handler(newUserLinks) {
        this.links = [...newUserLinks];
        this.getLinksIcons();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getLinksIcons() {
      this.links.forEach((item) => {
        item.linkIcon = ICONS_DATA.BASE_ICONS_URI + ICONS_DATA.LINK_ICONS[item.name].iconUrl;
      });
    },
  },
};
</script>

<style scoped>
.user-links-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--regular-block-gap);
  scroll-snap-type: both mandatory;
}

.user-link {
  width: 45%;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--regular-block-gap);
  text-decoration: none;
  margin-bottom: 5px;
}

.user-link img {
  height: 20px;
  width: 20px;
  object-fit: contain;
  -webkit-filter: sepia() saturate(10000%) hue-rotate(20deg);
  filter: sepia() saturate(10000%) hue-rotate(20deg);
}

.user-link-url {
  font-size: var(--small-font-size);
  letter-spacing: 1px;
  text-decoration: none;
  color: var(--color-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-link a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
