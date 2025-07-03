<template>
  <div class="information-message-holder">
    <div class="message-text-holder">
      <h3>
        {{ modalProps.message }}
      </h3>
    </div>
    <div class="submit-button-holder">
      <button class="large submit-button" @click="handler()">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "InformationMessage",
  props: {
    modalProps: {
      type: Object,
      required: false,
      default: null,
    },
  },
  methods: {
    handler() {
      if (this.modalProps.handleFunction) {
        return this.modalProps.handleFunction();
      } else {
        if (this.modalProps.closeAction) {
          this.modalProps.closeAction();
        }
        return this.closeModal();
      }
    },
    closeModal() {
      this.$modal.close();
    },
  },
};
</script>

<style scoped>
.information-message-holder {
  max-width: 500px;
  padding: 50px;
  background: var(--color-dark);
  border-radius: var(--medium-border-radius);
  box-shadow: 0 0 10px var(--color-accent-primary);
}

.message-text-holder {
  max-width: 350px;
  height: 100%;
  text-align: center;
  margin-bottom: 30px;
  color: var(--color-gray);
  word-wrap: break-word;
}

.submit-button-holder {
  display: flex;
  justify-content: center;
}

.submit-button {
  height: 50px !important;
  line-height: 50px;
  width: 200px !important;
}
</style>
