<template>
  <TabbedPane>
    <DynamicTab label="Creators">
      <ApproveCreatorsPage class="item" :unapproved-creators="unapprovedCreators" />
    </DynamicTab>
    <DynamicTab label="Artists">
      <ApproveArtistsPage class="item" :unapproved-artists="unapprovedArtists" />
    </DynamicTab>
  </TabbedPane>
</template>

<script>
import ApproveCreatorsPage from "@/pages/adminPanel/ApproveCreatorsPage.vue";
import ApproveArtistsPage from "@/pages/adminPanel/ApproveArtistsPage.vue";
import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";

export default {
  name: "AdminRequests",
  components: {
    ApproveCreatorsPage,
    ApproveArtistsPage,
    TabbedPane,
    DynamicTab,
  },
  props: {
    unapprovedArtists: {
      type: Array,
      required: true,
    },
    unapprovedCreators: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 90px;
}
</style>
