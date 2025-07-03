<template>
  <div class="access-creators-page">
    <CardsPageFilter v-show="false" />
    <div v-if="unapprovedCreators.length" class="user-list-wrapper">
      <div v-for="user in unapprovedCreators" :key="user.claim_id" class="user-plug-wrapper">
        <UserPlug class="user-plag-item" :user="user.user" />
        <div class="button accept-button" @click="openModalApprovingCreator(user)">View profile</div>
      </div>
    </div>
    <h3 v-else class="info-message">
      {{ messageStatus.ARTISTS_REQUESTS_IS_EMPTY }}
    </h3>
  </div>
</template>

<script>
import UserPlug from "@/components/common/info/UserPlug/UserPlug.vue";
import CardsPageFilter from "@/components/common/navigation/filters/CardsPageFilter.vue";
import memberModal from "@/components/structure/modals/artist/MemberModal.vue";
import messageStatus from "@/data/navbar/message/messageStatus.json";
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import entityTypes from "@/data/user/entityTypes.json";

export default {
  components: {
    UserPlug,
    CardsPageFilter,
  },
  data() {
    return {
      unapprovedCreators: [],
      messageStatus,
    };
  },
  created() {
    this.$eventBus.on("updated-unapprove-creators", () => {
      this.getUnapprovedCreators();
    });
  },
  async mounted() {
    await this.getUnapprovedCreators();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    memberModalProps(user) {
      return {
        displayedComponent: memberModal,
        displayedComponentProps: {
          user: user.user,
          claimID: user.claim_id,
          memberType: entityTypes.TYPE_USER_APPROVE,
          isApprove: false,
        },
      };
    },
    openModalApprovingCreator(user) {
      this[modalActions.SET_MODAL](this.memberModalProps(user));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    async getUnapprovedCreators() {
      await this.$load(
        async () => {
          const {
            data: { data: resdata },
          } = await this.$api.user.getClaimsForRoleCreator();
          this.unapprovedCreators = resdata;
        },
        null,
        false
      );
    },
  },
};
</script>

<style scoped>
.page-header {
  margin-bottom: 40px;
}

.user-list-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.accept-button {
  font-size: var(--regular-font-size);
  padding: 0 10px;
  background: var(--color-accent-primary);
}

.button:hover {
  -webkit-text-fill-color: black;
}
.user-plug-wrapper {
  width: 47%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.user-plag-item {
  width: 70%;
}
</style>
