<template>
  <div class="profile-page">
    <ProfileHeader :is-user-card="false" :user="currentUser" />
    <TabbedPane>
      <DynamicTab label="Profile">
        <ProfileData :user-data="currentUser" />
      </DynamicTab>
      <DynamicTab label="Team">
        <ArtistsList :artists="currentUser.members" :is-team-page="true" />
      </DynamicTab>
      <DynamicTab label="Forum">
        <UserForum />
      </DynamicTab>
    </TabbedPane>
    <!-- <SocialLinks /> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import ProfileHeader from "@/components/common/headers/ProfileHeader.vue";
import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import ProfileData from "@/components/structure/user/general/ProfileData.vue";
import ArtistsList from "@/components/structure/user/artist/ArtistsList.vue";
import UserForum from "@/components/structure/user/general/UserForum.vue";

export default {
  name: "ProfilePage",
  components: {
    ProfileHeader,
    TabbedPane,
    DynamicTab,
    ProfileData,
    ArtistsList,
    UserForum,
  },
  computed: {
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
  },
};
</script>

<style scoped></style>
