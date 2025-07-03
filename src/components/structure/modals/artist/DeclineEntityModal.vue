<template>
  <div class="decline-modal">
    <div class="info-block">
      <h3 class="creator-name">{{ modalProps.entityName }}</h3>
      <h3 class="info">Reason for rejection</h3>
    </div>
    <div v-for="reason in reasonsList" :key="reason" class="reason-item">
      <input :id="reason" v-model="checkedReasonsList" type="checkbox" class="checkbox" name="selectRolesCheckBoxes" :value="reason" />
      <label :for="reason">{{ reason }}</label>
    </div>
    <div class="description-wrapper">
      <h3 class="description-reasons">Description</h3>
      <div class="text-area-holder">
        <textarea id="descriptionReason" v-model="descriptionDecline" name="descriptionReason" :maxlength="restrictionTextInput" placeholder="Detailed reason for rejection" />
        <div class="characters-counter-holder">{{ descriptionDecline.length }}/{{ restrictionTextInput }}</div>
      </div>
    </div>
    <div class="accept-button-wrapper">
      <div class="button large decline decline-button" @click="closeModal()">Close</div>
      <div class="button large accept-button" :class="{ disabled: !validReasons }" :disabled="validReasons" @click="sendDeclineRequest()">Send</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";
import entityTypes from "@/data/user/entityTypes.json";

export default {
  name: "DeclineEntityModal",
  props: {
    modalProps: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      entityTypes: entityTypes,
      descriptionDecline: "",
      checkedReasonsList: [],
      reasonsList: ["Photos are immoral", "Description is not true", "Links are not correct"],
      restrictionTextInput: 100,
    };
  },
  computed: {
    validReasons() {
      return this.checkedReasonsList.length && this.descriptionDecline.length;
    },
    isEntityArtist() {
      return this.modalProps.entityType === this.entityTypes.TYPE_ARTIST_APPROVE;
    },
    isEntityUser() {
      return this.modalProps.entityType === this.entityTypes.TYPE_USER_APPROVE;
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
    closeModal() {
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    async sendDeclineRequest() {
      await this.$load(async () => {
        await this.declineClaim();
      });
    },
    async declineClaim() {
      if (this.isEntityArtist) {
        await this.declineArtistClaim();
        this.$eventBus.emit("updated-unapprove-artists");
      } else {
        await this.declineCreatorClaim();
        this.$eventBus.emit("updated-unapprove-creators");
      }
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    async declineCreatorClaim() {
      await this.$load(async () => {
        await this.$api.user.declineCreatorClaim(this.modalProps.claimID, this.checkedReasonsList, this.descriptionDecline);
      });
    },
    async declineArtistClaim() {
      await this.$load(async () => {
        await this.$api.user.declineArtistClaim(this.modalProps.claimID, this.checkedReasonsList, this.descriptionDecline);
      });
    },
  },
};
</script>

<style scoped>
.decline-modal {
  width: 400px;
  max-height: 740px;
  border-radius: var(--medium-border-radius);
  padding: 30px;
  overflow: auto;
  box-sizing: border-box;
  background: var(--color-dark);
  color: var(--color-light);
}

.info,
.creator-name,
.description-reasons {
  margin-bottom: 25px;
}

.creator-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.info {
  color: var(--color-error);
}
.info-block {
  text-align: center;
}
.reason-item:not(:last-child) {
  margin-bottom: 25px;
}

.accept-button-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.text-area-holder {
  position: relative;
  margin-bottom: 1.25rem;

  display: flex;
  flex-direction: column;
  font-size: var(--forum-post-content-font-size);
  font-weight: var(--regular-font-weight);
  color: var(--color-gray);
}

.text-area-holder > textarea {
  resize: none;
  height: 120px;
  /* border: var(--input-border-width) solid var(--color-accent-primary); */
  border-radius: var(--regular-border-radius);
  padding: 1rem;
  font-size: var(--forum-post-content-font-size);
  font-weight: var(--regular-font-weight);
  color: var(--color-light);
}

.characters-counter-holder {
  position: absolute;
  bottom: 0.625rem;
  right: 0.9375rem;

  color: var(--color-accent-primary);

  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
