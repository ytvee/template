<template>
  <div class="main-menu">
    <div class="left-column">
      <CommandHistoryLineMenu />
      <BitrateLineMenu />
      <PlaybackLineMenu />
      <SecondaryPlaybackLineMenu />
    </div>
    <div class="right-column">
      <MasterMixerLineMenu />
      <MiscellaneousLineMenu />
      <!-- <NotificationLineMenu /> -->
    </div>
  </div>
</template>

<script>
import CommandHistoryLineMenu from "./mainmenu/CommandHistoryLineMenu.vue";
import BitrateLineMenu from "./mainmenu/BitrateLineMenu.vue";
import PlaybackLineMenu from "./mainmenu/PlaybackLineMenu.vue";
import SecondaryPlaybackLineMenu from "./mainmenu/SecondaryPlaybackLineMenu.vue";

import MasterMixerLineMenu from "./mainmenu/MasterMixerLineMenu.vue";
import MiscellaneousLineMenu from "./mainmenu/MiscellaneousLineMenu.vue";

// import NotificationLineMenu from "./mainmenu/NotificationLineMenu.vue";

export default {
  name: "MainMenu",
  components: {
    CommandHistoryLineMenu,
    BitrateLineMenu,
    PlaybackLineMenu,
    SecondaryPlaybackLineMenu,

    MasterMixerLineMenu,
    MiscellaneousLineMenu,
  },
};
</script>

<style scoped>
.main-menu {
  display: flex;
  justify-content: space-between;
}
.left-column,
.right-column {
  display: flex;
  gap: var(--regular-block-gap);
}
.right-column {
  margin-right: 27px;
}
:deep(.line-menu) {
  height: 44px;
  border-radius: var(--large-border-radius-2);
  background: var(--audio-editor-color-translucent-black-1);

  display: flex;
}
:deep(.line-menu-item) {
  min-width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  position: relative;
  color: var(--audio-editor-color-translucent-white-1);
  transition: color var(--default-transition), opacity var(--default-transition);

  /* border: 1px solid red; */
}
:deep(.line-menu-item:first-child) {
  padding-left: 4px;
}
:deep(.line-menu-item:last-child) {
  padding-right: 4px;
}

:deep(.line-menu-item:hover) {
  color: var(--audio-editor-color-white);
}
:deep(.line-menu-item.active) {
  color: var(--audio-editor-color-white);
}
:deep(.line-menu-item .solid) {
  height: calc(100% - 8px);
  border-radius: var(--large-border-radius);
  background: var(--audio-editor-color-translucent-white-4);

  display: flex;
  align-items: center;
  justify-content: center;
}
/* :deep(.line-menu-item.disabled) {
  opacity: 50%;  
} */
:deep(.line-menu-item .solid.accent) {
  background: var(--audio-editor-color-accent);
}

:deep(.line-menu-item.with-sub-items) {
  cursor: inherit;
  padding: 0;
}
:deep(.line-menu-item.with-sub-items:hover) {
  color: inherit;
}
:deep(.line-menu-item-subitem) {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color var(--default-transition);

  /* border: 1px solid green; */
}
:deep(.line-menu-item-subitem:hover) {
  color: var(--audio-editor-color-white);
}
:deep(.line-menu-item-subitem.active) {
  color: var(--audio-editor-color-white);
}
:deep(.line-menu-item-subitem.left) {
  padding-left: var(--default-padding);
}
:deep(.line-menu-item-subitem.right) {
  padding-right: var(--default-padding);
}

:deep(.line-menu-item-badge) {
  position: absolute;
  top: -4px;
  right: -4px;
  background: rgba(82, 187, 77, 1);
  padding: 2px 5px;
  border-radius: 31px;

  font-family: var(--audio-editor-font-label-small-family);
  font-size: var(--audio-editor-font-label-small-size);
  font-weight: var(--small-font-weight);
  letter-spacing: var(--audio-editor-font-label-small-letter);
  color: var(--audio-editor-color-white);
}
</style>
