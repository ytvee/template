<template>
  <div class="creator-teams">
    <div class="cards-container">
      <div class="add-new-member-wrapper" @click="openFindUserModal">
        <FileInput title="Add member" :is-enabled="false" input-id="SettingsArtistTeam" />
      </div>
      <UserPreviewCard v-if="currentUser" :user="currentUser" :is-current-user="true" />
      <UserPreviewCard v-for="user in currentArtist.addedMembers" :key="user.id" :user="user" @change-moderator-event="changeModeratorEventAddedUserHandler($event, user.id)" @remove-user-event="removeAddedUserEventHandler($event, user.id)" />
      <UserPreviewCard v-for="user in confirmedUsers" :key="user.id" :user="user" @change-moderator-event="changeModeratorEventConfirmedUserHandler($event, user.id)" @remove-user-event="removeConfirmedUserEventHandler($event, user.id)" />
      <UserPreviewCard v-for="user in unConfirmedUsers" :key="user.id" :user="user" is-un-confirmed-user="true" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";

import UserPreviewCard from "@/components/structure/user/artist/preview/UserPreviewCard.vue";
import FileInput from "@/components/structure/user/general/imageManager/PhotoInsert/FileInput.vue";
import FindUserModal from "../../roleForm/FindAndAddUserModal/FindUserModal.vue";
export default {
  name: "CreatorTeams",
  components: {
    UserPreviewCard,
    FileInput,
  },
  props: {
    currentArtist: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    findUserModalProps() {
      return {
        displayedComponent: FindUserModal,
        displayedComponentProps: {
          artistId: this.$props.currentArtist.id,
          addedMembers: this.$props.currentArtist.addedMembers,
        },
      };
    },
    currentUser() {
      const currentUser = this.$props.currentArtist?.members?.find((item) => {
        return item.isCurrentUser === true;
      });
      return currentUser || false;
    },
    confirmedUsers() {
      const confirmedUsers = this.$props.currentArtist?.members?.filter((item) => {
        return item.is_confirmed === true && !item.isCurrentUser;
      });
      return confirmedUsers;
    },
    unConfirmedUsers() {
      const unConfirmedUsers = this.$props.currentArtist?.members?.filter((item) => {
        return item.is_confirmed === false;
      });
      return unConfirmedUsers;
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    openFindUserModal() {
      this[modalActions.SET_MODAL](this.findUserModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    changeModeratorEventAddedUserHandler(event, userId) {
      this.$eventBus.emit("change-moderator-added-user-event", [event, userId]);
    },
    removeAddedUserEventHandler(event, userId) {
      this.$eventBus.emit("remove-added-user-event", userId);
    },
    changeModeratorEventConfirmedUserHandler(event, userId) {
      this.$eventBus.emit("change-moderator-confirmed-user-event", [event, userId]);
    },
    removeConfirmedUserEventHandler(event, userId) {
      this.$eventBus.emit("remove-confirmed-user-event", userId);
    },
  },
};
</script>

<style scoped>
* {
  --card-width: 240px;
  --cards-container-gap: 50px;
}

.title-holder {
  margin-bottom: 1.875rem;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--card-width), var(--card-width)));
  gap: var(--cards-container-gap);
  /* justify-content: center; */
}

.add-new-member-wrapper {
  width: var(--card-width);
  height: 280px;
}
</style>
