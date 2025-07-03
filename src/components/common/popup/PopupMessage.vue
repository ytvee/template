<template>
  <div class="message">
    <div class="content">
      <img class="mark" src="/assets/checkmark/checkmark.svg" />
      <div class="message-text">
        <slot />
      </div>
      <button class="btn-close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopupMessage",
};
</script>

<style scoped>
.message-text {
  font-size: var(--very-large-font-size);
  font-weight: var(--large-font-weight);
  text-align: center;
  margin: var(--margin-zero-auto);

  background-image: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.message {
  margin: 150px auto;
  width: 545px;
  height: 442px;
  border-radius: var(--medium-border-radius);
  background: var(--gradient-dark-to-light-solid);

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--color-light);
}

.content {
  height: 100%;
  width: 500px;
}

img {
  display: block;
  margin: var(--margin-zero-auto);
  margin-top: 35px;
  margin-bottom: 50px;
}

.btn-close {
  width: 160px;
  height: 60px;
  background: var(--gradient-primary);
  box-shadow: 2px 2px 9px var(--transparent-accent-20);
  border-radius: var(--small-border-radius);
  border: 0;

  font-family: var(--main-font-family);

  font-weight: var(--large-font-weight);
  font-size: var(--medium-font-size-3);

  display: block;
  margin: var(--margin-zero-auto);

  margin-top: 38px;
}

.btn-close:hover {
  background: var(--gradient-gradient-primary-1);
}

.btn-close:active {
  background: var(--gradient-primary);
  outline: none;
}
</style>
