<template>
  <TabbedPane class="category-holder">
    <DynamicTab label="Artists">
      <AdminArtistsTab />
    </DynamicTab>
    <DynamicTab label="Users">
      <AdminUsersTab class="item" :users="usersAndFans" />
    </DynamicTab>
    <DynamicTab label="Creators">
      <AdminUsersTab class="item" :users="creators" :is-modal-can-be-shown="true" />
    </DynamicTab>
    <DynamicTab label="Requests" :badge="countRequest">
      <AdminRequests class="item" />
    </DynamicTab>
  </TabbedPane>
</template>

<script>
import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import AdminRequests from "@/pages/adminPanel/AdminRequests.vue";
import AdminArtistsTab from "@/pages/adminPanel/AdminArtistsTab.vue";
import AdminUsersTab from "@/pages/adminPanel/AdminUsersTab.vue";
import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import { Roles } from "@/utils/types/roles.types";

export default {
  name: "AdminPanelPage",
  components: {
    AdminRequests,
    AdminArtistsTab,
    AdminUsersTab,
    TabbedPane,
    DynamicTab,
  },
  data() {
    return {
      usersAndFans: [],
      creators: [],
      unapprovedCreators: [],
      unapprovedArtists: [],
    };
  },
  computed: {
    countRequest() {
      return this.unapprovedCreators.length + this.unapprovedArtists.length;
    },
  },
  created() {
    this.loadSource();
    this.$eventBus.on("updated-creators", () => {
      this.getCreators();
    });
    this.$eventBus.on("updated-users", () => {
      this.getUsers();
    });
    this.$eventBus.on("updated-unapprove-creators", () => {
      this.getCreators();
    });
  },
  methods: {
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_IS_LOADING]),
    async loadSource() {
      this.getUsers();
      this.getCreators();
    },
    async getCreators() {
      await this.$load(
        async () => {
          const {
            data: { data: resdata },
          } = await this.$api.user.getCreators();
          this.creators = resdata.users;
        },
        null,
        false
      );
    },
    async getUsers() {
      await this.$load(
        async () => {
          const roles = Roles.USER;
          const {
            data: { data: resdata },
          } = await this.$api.user.getUsersWithFilters(roles, Number(true));
          this.usersAndFans = resdata.users;
        },
        null,
        false
      );
    },
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 90px;
}

.category-holder {
  padding-top: 50px;
}
</style>
