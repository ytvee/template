<template>
  <div class="artist-edit-page">
    <ProfileHeader :is-user-card="false" :user="currentUser" :profile-edit-page="true" />
    <ProfileDataEdit />
  </div>
</template>

<script>
import ProfileHeader from "@/components/common/headers/ProfileHeader.vue";
import ProfileDataEdit from "@/pages/profile/SettingsUserProfile.vue";
import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";

export default {
  name: "ProfileEditPage",
  components: {
    ProfileHeader,
    ProfileDataEdit,
  },
  computed: {
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
  },
};
</script>

<style></style>
