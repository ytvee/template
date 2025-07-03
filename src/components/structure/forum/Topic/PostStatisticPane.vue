<template>
  <div class="post-statistics-pane-holder">
    <div class="post-statistics-pane-item">
      <div class="row">created</div>
      <div class="row">
        <div class="statistics-round-avatar-holder">
          <RoundAvatar :avatar-src="getTopicCreatorAvatarSrc" :avatar-alt="getTopicCreatorName" />
        </div>
        <div class="text-holder">
          <h3>{{ statisticPaneRoundedData.creation.createdTimeAgo }}</h3>
        </div>
      </div>
    </div>
    <div class="post-statistics-pane-item">
      <div class="row">last reply</div>
      <div class="row">
        <div v-if="statisticPaneRoundedData.lastReply.lastReplyTimeAgo" class="statistics-round-avatar-holder">
          <RoundAvatar :avatar-src="getLastPosterAvatarSrc" :avatar-alt="getLastPosterName" />
        </div>
        <div class="text-holder">
          <h3>
            {{ statisticPaneRoundedData.lastReply.lastReplyTimeAgo || "—" }}
          </h3>
        </div>
      </div>
    </div>
    <div class="post-statistics-pane-item">
      <div class="row">
        <h2>{{ statisticPaneRoundedData.posts }}</h2>
      </div>
      <div class="row">posts</div>
    </div>
    <div class="post-statistics-pane-item">
      <div class="row">
        <h2>{{ statisticPaneRoundedData.views }}</h2>
      </div>
      <div class="row">views</div>
    </div>
    <div class="post-statistics-pane-item">
      <div class="row">
        <h2>{{ statisticPaneRoundedData.users }}</h2>
      </div>
      <div class="row">users</div>
    </div>
    <div class="post-statistics-pane-item">
      <div class="row">
        <h2>{{ statisticPaneRoundedData.likes }}</h2>
      </div>
      <div class="row">likes</div>
    </div>
  </div>
</template>

<script>
import modules from "@/data/injectableModules/modules.json";
import RoundAvatar from "@/components/common/user/RoundAvatar.vue";
import { getDiscourseAvatarSrc } from "./PostElement.vue";

export default {
  name: "PostStatisticPane",
  components: {
    RoundAvatar,
  },
  inject: [modules.ROUND_NUMBER, modules.ROUND_DATE],
  props: {
    statisticPaneData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getLastPosterName() {
      return this.$props.statisticPaneData?.lastReply?.lastPoster?.name;
    },
    getTopicCreatorName() {
      return this.$props.statisticPaneData?.creation?.createdBy?.name;
    },
    getTopicCreatorAvatarSrc() {
      const avatarTemplate = this.$props.statisticPaneData?.creation?.createdBy?.avatar_template;
      const discourseHost = this.$props.statisticPaneData?.discourseHost;
      return getDiscourseAvatarSrc(avatarTemplate, discourseHost);
    },
    getLastPosterAvatarSrc() {
      const avatarTemplate = this.$props.statisticPaneData?.lastReply?.lastPoster?.avatar_template;
      const discourseHost = this.$props.statisticPaneData?.discourseHost;
      return getDiscourseAvatarSrc(avatarTemplate, discourseHost);
    },
    statisticPaneRoundedData() {
      return {
        creation: {
          createdTimeAgo: this[modules.ROUND_DATE](new Date(this.statisticPaneData.creation?.createdAt)),
          createdBy: this.statisticPaneData?.createdBy || {},
        },
        lastReply: {
          lastReplyTimeAgo: this.statisticPaneData.lastReply?.lastPostedAt && this[modules.ROUND_DATE](new Date(this.statisticPaneData.lastReply?.lastPostedAt)),
          lastPoster: this.statisticPaneData?.lastPoster || {},
        },
        posts: this[modules.ROUND_NUMBER](this.statisticPaneData?.posts),
        views: this[modules.ROUND_NUMBER](this.statisticPaneData?.views),
        users: this[modules.ROUND_NUMBER](this.statisticPaneData?.users),
        likes: this[modules.ROUND_NUMBER](this.statisticPaneData?.likes),
      };
    },
  },
};
</script>

<style scoped>
.post-statistics-pane-holder {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 100px;
  background: var(--transparent-light-10);
  border-radius: var(--forum-post-statistics-pane-border-radius);

  font-size: var(--medium-font-size-2);
  color: var(--color-light);
}

.post-statistics-pane-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--smallest-block-gap);
}

.statistics-round-avatar-holder {
  max-height: 40px;
  max-width: 40px;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.9375rem;
}

.text-holder {
  height: 40px;
  display: grid;
  place-items: center;
}
</style>
