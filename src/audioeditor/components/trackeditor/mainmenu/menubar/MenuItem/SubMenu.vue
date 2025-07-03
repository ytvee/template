<template>
  <div class="sub-menu">
    <slot name="sub-menu-content"></slot>
  </div>
</template>

<script></script>

<style scoped>
.sub-menu {
  color: red;
  background: green;
  border-radius: var(--audio-editor-default-border-radius);
  padding: var(--default-padding);
}
</style>
