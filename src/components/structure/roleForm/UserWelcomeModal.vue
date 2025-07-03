<template>
  <div class="chose-account-holder">
    <div class="content-holder">
      <div class="title-holder">
        <h2>How become a fan?</h2>
      </div>
      <div class="main-content">
        <h3>Only fans can write in forum</h3>
        <h4>If you want to chat with artists, just click "Follow" on the artist's page</h4>
      </div>
      <div class="title-holder">
        <h2>How become a Creator?</h2>
      </div>
      <div class="main-content tall-text">
        <h3>
          Come to settings page and find
          <div class="button medium outlined fake-button">My roles</div>
          button
        </h3>
      </div>
      <div class="buttons-holder">
        <button class="large" @click="setModalVisibility(false)">Got it!</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";

export default {
  name: "FanWelcomeModal",
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
  },
};
</script>

<style scoped>
.chose-account-holder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-dark);
  width: 550px;
  /* height: 600px; */
  border-radius: var(--medium-border-radius);
}
.content-holder {
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5625rem;
}
.title-holder h2 {
  color: var(--color-gray);
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.25rem;
}
.main-content svg {
  margin-bottom: 45px;
}
.main-content h3 {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.25rem;
  text-align: center;
}
.main-content.tall-text {
  margin-bottom: 50px;
}
.main-content.tall-text h3 {
  line-height: 197.5%;
  margin-bottom: 0px;
}
.main-content h4 {
  color: var(--color-gray);
  text-align: center;
}

.buttons-holder {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

button {
  width: 200px !important;
}
.fake-button {
  display: inline-flex;
  white-space: nowrap;
  pointer-events: none;
}
</style>
