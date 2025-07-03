<template>
  <div class="profile-page">
    <ProfileHeader :is-user-card="false" :username="username" :profile-categoty="profileCategoty" />
    <TabbedPane>
      <DynamicTab label="Profile">
        <ProfileData :user-data="{}" />
      </DynamicTab>
      <DynamicTab label="Team">
        <ArtistsList />
      </DynamicTab>
      <DynamicTab label="Forum">
        <UserForum />
      </DynamicTab>
    </TabbedPane>
  </div>
</template>
<script>
import ProfileHeader from "@/components/ui/profile/ProfileHeader.vue";
import TabbedPane from "@/components/common/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import ProfileData from "../general/ProfileData.vue";
import ArtistsList from "@/components/structure/user/artist/ArtistsList.vue";
import UserForum from "../general/UserForum.vue";

export default {
  name: "CreatorProfile",
  components: {
    ProfileHeader,
    TabbedPane,
    DynamicTab,
    ProfileData,
    ArtistsList,
    UserForum,
  },
  data() {
    return {
      userLinks: [
        {
          imageKey: "twitter",
          link: "https://twitter.com/theweeknd/",
        },
        {
          imageKey: "web",
          link: "https://www.theweeknd.com/",
        },
      ],
      profileCategoty: "Artist",
      username: "JHONNY_21",
    };
  },
};
</script>
<style scoped></style>
