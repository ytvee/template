<template>
  <div class="user-input-refresh-button">
    <svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.412109 19C0.412109 8.50659 8.9187 0 19.4121 0C29.9055 0 38.4121 8.50659 38.4121 19C38.4121 29.4934 29.9055 38 19.4121 38C8.9187 38 0.412109 29.4934 0.412109 19Z" fill="#4D4E4D" />
      <path
        class="circled-arrows"
        d="M19.4585 26.6611C17.3846 26.6611 15.6202 25.919 14.1654 24.4346C12.7106 22.9503 11.9831 21.1387 11.9831 19V18.8324L10.4973 20.3646L9.19727 19.0239L12.9118 15.1934L16.6262 19.0239L15.3262 20.3646L13.8404 18.8324V19C13.8404 20.5961 14.3859 21.9527 15.4771 23.07C16.5682 24.1872 17.8954 24.7458 19.4585 24.7458C19.8609 24.7458 20.2556 24.698 20.6425 24.6022C21.0295 24.5064 21.4086 24.3628 21.7801 24.1713L23.173 25.6077C22.5849 25.9589 21.9813 26.2222 21.3622 26.3978C20.7431 26.5733 20.1086 26.6611 19.4585 26.6611ZM25.9125 22.8066L22.198 18.9761L23.498 17.6354L24.9838 19.1676V19C24.9838 17.4039 24.4383 16.0473 23.3471 14.93C22.256 13.8128 20.9289 13.2542 19.3657 13.2542C18.9633 13.2542 18.5686 13.302 18.1817 13.3978C17.7948 13.4936 17.4156 13.6372 17.0441 13.8287L15.6512 12.3923C16.2393 12.0411 16.8429 11.7778 17.462 11.6022C18.0811 11.4267 18.7156 11.3389 19.3657 11.3389C21.4396 11.3389 23.204 12.081 24.6588 13.5654C26.1137 15.0497 26.8411 16.8613 26.8411 19V19.1676L28.3269 17.6354L29.627 18.9761L25.9125 22.8066Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "RefreshButton",
};
</script>

<style scoped>
.user-input-refresh-button,
.user-input-refresh-button svg {
  width: 32px;
  height: 32px;
}

.user-input-refresh-button svg .circled-arrows {
  fill: var(--ai-chat-button-background-color-1);
  transition: fill var(--default-transition);
}

.user-input-refresh-button:hover,
.user-input-refresh-button:hover .circled-arrows {
  fill: var(--ai-chat-color-white);
  cursor: pointer;
  transition: fill var(--default-transition);
}
</style>
