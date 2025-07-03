<template>
  <div class="profile-data">
    <div class="profile-data-wrapper">
      <div class="user-gallery">
        <UserGallery :img-list="userData?.images" />
      </div>
      <div class="user-data">
        <h3 class="bio">Bio</h3>
        <div class="description-wrapper">
          <p ref="description" class="description">
            {{ userData?.description }}
          </p>
          <div class="description-shadow"></div>
        </div>
        <div class="read-more" @click="openModalReadMore()">Read more</div>
        <SocialLinks :user-links="userData?.links" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import UserGallery from "@/components/structure/user/general/userGallery/UserGallery.vue";
import SocialLinks from "@/components/common/info/socialLinks/SocialLinks.vue";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import ReadMore from "../../modals/info/ReadMore.vue";

export default {
  components: {
    UserGallery,
    SocialLinks,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const descriptionRootObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const parentElement = entry.target.parentElement;
        const element = entry.contentRect;
        const elementHeight = Math.floor(element.height);
        const shadowBlock = entry.target.nextElementSibling;
        const readMoreButton = parentElement.nextElementSibling;
        if (parentElement.clientHeight < elementHeight) {
          readMoreButton.style.display = "block";
          shadowBlock.style.display = "block";
        } else {
          readMoreButton.style.display = "none";
          shadowBlock.style.display = "none";
        }
      });
    });

    return {
      descriptionRootObserver,
    };
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      shownDescriptionLines: 5,
    };
  },
  computed: {
    modalProps() {
      return {
        displayedComponent: ReadMore,
        displayedComponentProps: this.userData?.description,
      };
    },
  },
  mounted() {
    this.observeDescription();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    openModalReadMore() {
      this[modalActions.SET_MODAL](this.modalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    observeDescription() {
      this.descriptionRootObserver.observe(this.$refs.description);
    },
  },
};
</script>

<style scoped>
.profile-data-wrapper {
  display: flex;
  gap: 30px;
  height: 300px;
}

.user-gallery {
  flex: 0 0 60%;
}

.user-data {
  flex: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.description-wrapper {
  overflow: hidden;
  position: relative;
}

.description-shadow {
  position: absolute;
  height: 15%;
  width: 100%;
  bottom: 0;
  background: var(--gradient-transparent-to-dark);
}
.read-more {
  color: var(--color-accent-primary);
  font-size: var(--medium-font-size-2);
  cursor: pointer;
  line-height: 130%;
}
</style>
