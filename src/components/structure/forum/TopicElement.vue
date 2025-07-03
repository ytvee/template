<template>
  <div class="topic-element">
    <div class="element-title">
      <div v-if="pinned" class="svg-button danger unpin-button" :class="{ disabled: !canPinTopic }" @click="canPinTopic ? changePinStatus(false) : null">
        <svg viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.9792 15.8847C19.744 14.9407 19.1881 14.1504 18.4538 13.674C17.9163 13.3257 17.2508 12.7841 17.1296 12.2297L15.2924 3.83345C15.1712 3.27931 15.1033 2.82999 15.1419 2.82999H15.2104C16.2717 2.82999 17.1788 2.07285 17.5355 1.00753C17.7174 0.464771 17.144 0 16.46 0L3.54012 0.000237117C2.85645 0.000237117 2.28277 0.464984 2.46435 1.00777C2.82131 2.07339 3.72804 2.83022 4.79025 2.83022H4.85876C4.89676 2.83022 4.82854 3.27956 4.70735 3.83369L2.87018 12.23C2.74899 12.7844 2.08314 13.326 1.54628 13.6743C0.81165 14.1502 0.255768 14.9409 0.0206135 15.8849C-0.116699 16.4367 0.451837 16.8977 1.13581 16.8977H8.79252L8.79195 23.9027H8.81123C8.90335 26.786 9.43244 29 10.0741 29C10.7158 29 11.2449 26.786 11.337 23.9027H11.3563L11.3566 16.8971H18.8644C19.5481 16.8971 20.1169 16.4359 19.9793 15.8841L19.9792 15.8847Z" fill="url(#paint0_linear_1585_7696)" />
          <defs>
            <linearGradient id="paint0_linear_1585_7696" x1="-1.85714" y1="-0.966669" x2="23.0045" y2="1.98231" gradientUnits="userSpaceOnUse">
              <stop stop-color="#74DE6F" />
              <stop offset="0.859375" stop-color="#CDE768" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h3>
        <router-link :to="{ path: `/forum/${id}` }">
          {{ title }}
        </router-link>
      </h3>
      <div v-if="canPinTopic && !pinned" class="svg-button opacity" @click="changePinStatus(true)">
        <svg viewBox="74.3597 34.2394 25.5171 25.6216" width="25.517" height="25.622" xmlns="http://www.w3.org/2000/svg">
          <path d="M 90.734 57.495 C 91.235 56.661 91.401 55.709 91.218 54.852 C 91.084 54.227 90.997 53.372 91.303 52.895 L 95.941 45.659 C 96.247 45.182 96.517 44.816 96.545 44.843 L 96.593 44.891 C 97.343 45.642 98.52 45.748 99.525 45.247 C 100.038 44.992 99.962 44.258 99.478 43.774 L 90.342 34.638 C 89.858 34.155 89.124 34.078 88.868 34.59 C 88.367 35.596 88.474 36.772 89.225 37.523 L 89.273 37.571 C 89.3 37.598 88.933 37.868 88.456 38.175 L 81.22 42.812 C 80.742 43.119 79.889 43.031 79.262 42.898 C 78.407 42.714 77.454 42.88 76.621 43.382 C 76.133 43.675 76.209 44.403 76.693 44.886 L 82.107 50.301 L 77.154 55.254 L 77.167 55.267 C 75.194 57.371 74.002 59.311 74.456 59.765 C 74.909 60.218 76.85 59.027 78.953 57.054 L 78.967 57.067 L 83.921 52.113 L 89.23 57.422 C 89.713 57.906 90.442 57.982 90.734 57.494 L 90.734 57.495 Z" />
        </svg>
      </div>
    </div>
    <div class="element-flex">
      <div class="column-primary">
        <p>
          {{ excerpt }}
        </p>
        <span v-if="false" class="read-more">read more</span>
      </div>
      <div class="column-secondary">
        {{ repliesRounded }}
      </div>
      <div class="column-secondary">
        {{ viewsRounded }}
      </div>
      <div class="column-secondary">
        {{ activityRounded }}
      </div>
    </div>
    <div class="element-flex">
      <div class="tags">
        <ForumTag v-for="tag of tags" :key="tag" :tag-name="tag" />
      </div>
      <div class="topic-controls-additional">
        <div v-if="false" class="svg-button danger" @click="deletePostHandler">
          <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.75 17.9375C7.75 18.3242 7.40625 18.625 7.0625 18.625C6.67578 18.625 6.375 18.3242 6.375 17.9375V9C6.375 8.65625 6.67578 8.3125 7.0625 8.3125C7.40625 8.3125 7.75 8.65625 7.75 9V17.9375ZM11.1875 17.9375C11.1875 18.3242 10.8438 18.625 10.5 18.625C10.1133 18.625 9.8125 18.3242 9.8125 17.9375V9C9.8125 8.65625 10.1133 8.3125 10.5 8.3125C10.8438 8.3125 11.1875 8.65625 11.1875 9V17.9375ZM14.625 17.9375C14.625 18.3242 14.2812 18.625 13.9375 18.625C13.5508 18.625 13.25 18.3242 13.25 17.9375V9C13.25 8.65625 13.5508 8.3125 13.9375 8.3125C14.2812 8.3125 14.625 8.65625 14.625 9V17.9375ZM14.4961 1.82422L16.0859 4.1875H19.0938C19.6523 4.1875 20.125 4.66016 20.125 5.21875C20.125 5.82031 19.6523 6.25 19.0938 6.25H18.75V19.3125C18.75 21.2461 17.2031 22.75 15.3125 22.75H5.6875C3.75391 22.75 2.25 21.2461 2.25 19.3125V6.25H1.90625C1.30469 6.25 0.875 5.82031 0.875 5.21875C0.875 4.66016 1.30469 4.1875 1.90625 4.1875H4.87109L6.46094 1.82422C6.89062 1.17969 7.66406 0.75 8.48047 0.75H12.4766C13.293 0.75 14.0664 1.17969 14.4961 1.82422ZM7.36328 4.1875H13.5938L12.7773 2.98438C12.7344 2.89844 12.6055 2.8125 12.4766 2.8125H8.48047C8.35156 2.8125 8.22266 2.89844 8.17969 2.98438L7.36328 4.1875ZM4.3125 19.3125C4.3125 20.0859 4.91406 20.6875 5.6875 20.6875H15.3125C16.043 20.6875 16.6875 20.0859 16.6875 19.3125V6.25H4.3125V19.3125Z"
              fill="#676767"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ForumTag from "../../common/navigation/tags/ForumTag.vue";
import modules from "@/data/injectableModules/modules.json";
import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";
import DeleteTopicModal from "@/components/structure/modals/forum/DeleteTopicModal.vue";
import topicStatus from "@/data/forum/topicStatus.json";

const TOPIC = "topic";

export default {
  name: "TopicElement",
  components: {
    ForumTag,
  },
  inject: [modules.ROUND_NUMBER, modules.ROUND_DATE],
  props: {
    id: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    replies: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    pinned: {
      type: Boolean,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    canPinTopic: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["updated-pinned-state-topic"],
  computed: {
    repliesRounded() {
      return this[modules.ROUND_NUMBER](this.replies);
    },
    viewsRounded() {
      return this[modules.ROUND_NUMBER](this.views);
    },
    activityRounded() {
      return this[modules.ROUND_DATE](new Date(this.activity));
    },
    deleteTopicModalProps() {
      return {
        displayedComponent: DeleteTopicModal,
        displayedComponentProps: {
          categoryId: this.categoryId,
          topicId: this.$props.id,
          type: TOPIC,
        },
      };
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL, modalActions.SET_MODAL_VISIBILITY]),
    deletePostHandler() {
      this[modalActions.SET_MODAL](this.deleteTopicModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    async changePinStatus(isTopicPin) {
      const payload = {
        id: this.id,
        status: topicStatus.PINNED,
        enabled: String(isTopicPin),
        until: "2223-12-31", //date of execpt pinned
      };
      await this.$load(async () => {
        await this.$api.forum.updateTopicStatus(payload);
      });
      this.$emit("updated-pinned-state-topic");
    },
  },
};
</script>

<style scoped>
.topic-element {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid;
  border-image: var(--gradient-card-dark) 1;
}

.element-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 1rem;
}

.element-title svg {
  flex: none;
  height: 20px;
}

.element-title h3 {
  min-width: 0;
  overflow-wrap: break-word;
}

.element-title a {
  text-decoration: none;
  color: var(--color-light);
}
.element-title .svg-button.opacity {
  opacity: 0;
  transition: var(--default-transition);
}
.element-title:hover .svg-button {
  opacity: 100%;
  transition: var(--default-transition);
}

.unpin-button {
  height: 29px;
  width: 20px;
}
.unpin-button.disabled {
  opacity: unset !important;
}
.unpin-button svg {
  width: 100%;
  height: 100%;
}
.unpin-button svg path {
  fill: var(--color-accent-primary);
  transition: var(--default-transition);
}

.element-flex {
  display: flex;
  align-items: baseline;
  gap: var(--regular-block-gap);
}

p {
  font-size: var(--medium-font-size-2);
  font-weight: var(--small-font-weight);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  font-weight: var(--medium-font-weight);
}

.tags {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--regular-block-gap);
  flex-grow: 1;
}
</style>
