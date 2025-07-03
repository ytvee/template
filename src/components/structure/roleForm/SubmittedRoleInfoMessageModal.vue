<template>
  <div class="submitted-role-info-message-modal-holder">
    <div class="content-holder">
      <div class="main-content">
        <h3>You have submitted a request for role verification</h3>
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
  name: "SubmittedRoleInfoMessageModal",
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
  },
};
</script>

<style scoped>
.submitted-role-info-message-modal-holder {
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
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-content {
  margin-bottom: 30px;
  text-align: center;
}

.buttons-holder {
  width: 100%;
  display: flex;
  justify-content: center;
}

button {
  width: 200px !important;
}
</style>
