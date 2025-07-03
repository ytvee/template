<template>
  <div class="preview-card">
    <div class="card-preview-image-holder">
      <div class="image-holder" @click="showArtistInformation()">
        <EntityImage :artist="artist" />
        <FavoritesButton v-if="isFavoritesButtonToBeShown" class="like-button" :theme-type="favoritesButtonThemes.DARK" :like-content="artist" :button-selection="buttonsProfile.FAVORITES" />
      </div>
    </div>
    <div class="card-preview-information-holder">
      <div class="card-title" :title="artist.name">
        <router-link
          v-if="!isUserPrewiewCardInAdminPanel && !isUserPrewiewCardInArtistTeam"
          :class="{
            'card-title-name-in-modal': isUserPrewiewCardInMemberModal,
          }"
          :to="{ path: `/artist/${artist.id}` }"
        >
          {{ artist.name }}
        </router-link>
        <div v-else class="card-title-name">
          {{ artist.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tabTypes from "@/data/router/tabs/tabTypes.json";
import EntityImage from "@/components/common/entity/EntityImage.vue";
import FavoritesButton from "@/components/common/navigation/buttons/FavoritesButton.vue";
import buttonsProfile from "@/data/navbar/buttons/buttonsProfile.json";
import favoritesButtonThemes from "@/data/theme/favoritesButtonThemes.json";

export default {
  name: "PreviewCard",
  components: {
    FavoritesButton,
    EntityImage,
  },
  props: {
    artist: {
      type: Object,
      required: true,
    },
    isFavoritesButtonToBeShown: {
      type: Boolean,
      required: false,
      default: false,
    },
    variant: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      buttonsProfile,
      favoritesButtonThemes,
    };
  },
  computed: {
    isUserPrewiewCardInArtistTeam() {
      return this.$props.variant === tabTypes.TEAM;
    },
    isUserPrewiewCardInMemberModal() {
      return this.$props.variant === tabTypes.MEMBER_MODAL;
    },
    isUserPrewiewCardInAdminPanel() {
      return this.$props.variant === tabTypes.ADMIN_PANEL;
    },
  },
  methods: {
    showArtistInformation() {
      if (!this.isUserPrewiewCardInArtistTeam && !this.isUserPrewiewCardInAdminPanel) {
        this.$router.push({ path: `/artist/${this.artist.id}` });
      }
    },
  },
};
</script>

<style scoped>
.artist-modal .preview-card {
  width: 160px;
  height: 230px;
  flex-shrink: 0;
}

.artist-modal .preview-card .card-title {
  font-size: var(--small-font-size);
}

.card-title-a:hover:after {
  content: attr(data-name);
  position: absolute;
  top: 5%;
  left: 0;
  z-index: 1;
  background: var(--color-light);
  color: black;
  font-size: var(--smallest-font-size);
  padding: 3px;
}

.preview-card {
  position: relative;
  width: 240px;
  height: 280px;
  border-radius: var(--medium-border-radius);
  background: var(--gradient-card-dark);
  padding: 5px;
  margin-bottom: 25px;
}

.card-preview-image-holder {
  position: relative;
  width: 100%;
  margin: var(--margin-zero-auto);
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: var(--medium-border-radius);
}
.preview-card:hover a {
  color: var(--color-accent-primary);
}
.preview-card:hover {
  box-shadow: 0 0 7px var(--color-accent-primary);
  transition: 0.2s;
}

.image-holder {
  position: relative;
  width: 100%;
  height: 180px;
  user-select: none;
  cursor: pointer;
}

.image-holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.like-button {
  position: absolute;
  top: 10px;
  right: 5%;
  width: 35px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid var(--color-light);
  border-radius: var(--small-border-radius);
  cursor: pointer;
}

.card-preview-information-holder {
  display: flex;
  flex-direction: column;
  padding-left: var(--default-padding);
}

.card-title {
  margin-bottom: 5px;
  padding: 5px;
  display: block;
  max-width: 280px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--large-font-size);
  font-weight: var(--large-font-weight);
}

.card-title a {
  text-decoration: none;
  color: var(--color-light);
  font-size: var(--large-font-size);
  font-weight: var(--large-font-weight);
}

.card-title-name {
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title-name-in-modal {
  color: var(--color-light) !important;
  font-size: var(--regular-font-size) !important;
  font-weight: var(--small-font-weight) !important;
}

.card-subtitle a {
  text-decoration: none;
  color: var(--color-light);
  font-size: var(--regular-font-size);
  font-weight: var(--small-font-weight);
}

.card-subtitle a:hover {
  color: var(--color-accent-primary);
}

.not-approved-info-wrapper {
  position: absolute;
  bottom: 10px;
  padding: 3px;
  border-radius: 3px;
  background-color: var(--color-error);
}

.not-approved-info {
  font-size: var(--smallest-font-size);
}
</style>
