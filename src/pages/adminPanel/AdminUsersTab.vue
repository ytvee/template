<template>
  <div>
    <CardsPageFilter v-show="false" />
    <div v-if="users" class="users-wrapper">
      <div v-for="user in users" :key="user.id" class="user-plag-wrapper">
        <UserPlug class="user-plug" :user="user" @click="openUserModal(user)" />
        <div class="remove-button button decline" @click="banUser(user.id)">Ban</div>
      </div>
    </div>
    <div v-else class="users-wrapper">{{ messageStatus.USERS_IS_UPLOAD }}</div>
  </div>
</template>

<script>
import CardsPageFilter from "@/components/common/navigation/filters/CardsPageFilter.vue";
import UserPlug from "@/components/common/info/UserPlug/UserPlug.vue";
import memberModal from "@/components/structure/modals/artist/MemberModal.vue";
import entityTypes from "@/data/user/entityTypes.json";
import messageStatus from "@/data/navbar/message/messageStatus.json";
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";

export default {
  components: {
    CardsPageFilter,
    UserPlug,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    isModalCanBeShown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      messageStatus,
    };
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    banUser(id) {
      if (!this.isModalCanBeShown) {
        this.$load(async () => {
          await this.$api.user.deleteUser(id);
          this.$eventBus.emit("updated-users");
        });
      } else {
        this.$load(async () => {
          await this.$api.user.deleteUser(id);
          this.$eventBus.emit("updated-creators");
        });
      }
    },
    memberModalProps(user) {
      return {
        displayedComponent: memberModal,
        displayedComponentProps: {
          id: user.id,
          claimID: user.id,
          memberType: entityTypes.TYPE_USER,
          isApprove: true,
        },
      };
    },
    openUserModal(user) {
      if (!this.isModalCanBeShown) {
        return;
      }
      this[modalActions.SET_MODAL](this.memberModalProps(user));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
  },
};
</script>

<style scoped>
.users-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.user-plag-wrapper {
  display: flex;
  justify-content: space-between;
  width: 45%;
}
.user-plug {
  width: 80%;
  margin-bottom: 20px;
  margin-right: 5px;
}
</style>
