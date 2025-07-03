<!--<template>-->
<!--  <div class="round-avatar" @mouseenter="isAvatarHovered = true" @mouseleave="isAvatarHovered = false">-->
<!--    <div v-if="isAvatarWithImageAndDisabledForUpload" class="profile-user-image-holder">-->
<!--      <img :src="avatarSrc" referrerpolicy="no-referrer" crossorigin/>-->
<!--    </div>-->
<!--    <div v-else-if="!isEnabledForUploading" class="profile-user-image-holder">-->
<!--      <svg width="40%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--        <path d="M40 0C45.3043 0 50.3914 2.10714 54.1421 5.85786C57.8929 9.60859 60 14.6957 60 20C60 25.3043 57.8929 30.3914 54.1421 34.1421C50.3914 37.8929 45.3043 40 40 40C34.6957 40 29.6086 37.8929 25.8579 34.1421C22.1071 30.3914 20 25.3043 20 20C20 14.6957 22.1071 9.60859 25.8579 5.85786C29.6086 2.10714 34.6957 0 40 0ZM40 50C62.1 50 80 58.95 80 70V80H0V70C0 58.95 17.9 50 40 50Z" fill="#1D2227" />-->
<!--      </svg>-->
<!--    </div>-->
<!--    <CommonFileInput v-if="isCommonFileInputVisible" @event-file="handleAvatarUpload">-->
<!--      <div class="upload-image-block">-->
<!--        <svg width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg" :alt="avatarAlt" :title="avatarAlt">-->
<!--          <path d="M40.2 0H26.8V27.2H0V40.8H26.8V68H40.2V40.8H67V27.2H40.2V0Z" fill="#1D2227" />-->
<!--        </svg>-->
<!--      </div>-->
<!--    </CommonFileInput>-->
<!--  </div>-->
<!--</template>-->

<template>
    <label
      class="track-avatar"
      @mouseenter="isAvatarHovered = true"
      @mouseleave="isAvatarHovered = false"
      :style="track && track.trackColor ? { border: `2px solid ${track.trackColor.primary}`} : ''"
    >
      <div v-if="isAvatarWithImageAndDisabledForUpload" class="profile-user-image-holder">
        <img :src="avatarSrc" referrerpolicy="no-referrer" crossorigin/>
      </div>
      <div v-else-if="!isEnabledForUploading" class="profile-user-image-holder">
        <svg width="40%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 0C45.3043 0 50.3914 2.10714 54.1421 5.85786C57.8929 9.60859 60 14.6957 60 20C60 25.3043 57.8929 30.3914 54.1421 34.1421C50.3914 37.8929 45.3043 40 40 40C34.6957 40 29.6086 37.8929 25.8579 34.1421C22.1071 30.3914 20 25.3043 20 20C20 14.6957 22.1071 9.60859 25.8579 5.85786C29.6086 2.10714 34.6957 0 40 0ZM40 50C62.1 50 80 58.95 80 70V80H0V70C0 58.95 17.9 50 40 50Z" fill="#1D2227" />
        </svg>
      </div>
      <CommonFileInput v-if="isCommonFileInputVisible" @event-file="handleAvatarUpload">
        <div ref="dragAndDropImageRef" class="upload-image-block">
          <svg width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg" :alt="avatarAlt" :title="avatarAlt">
            <path d="M40.2 0H26.8V27.2H0V40.8H26.8V68H40.2V40.8H67V27.2H40.2V0Z" fill="#1D2227" />
          </svg>
        </div>
      </CommonFileInput>
      <div v-if="track" class="color-input-holder">
        <input
          type="color"
          :value="track && track?.trackColor ? track?.trackColor.primary : ''"
          @input="colorInputHandler"
          @focus="colorInputFocusHandler"
          @blur="colorInputBlurHandler"
        />
      </div>
    </label>
</template>

<script>
import CommonFileInput from "@/components/common/navigation/inputs/CommonFileInput.vue";
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { ref } from "vue";

export default {
  name: "RoundAvatar",
  // emits: ['event-file'],
  components: {
    CommonFileInput,
  },
  props: {
    avatarSrc: {
      type: String,
      default: "",
    },
    avatarAlt: {
      type: String,
      required: false,
      default: "",
    },
    isEnabledForUploading: {
      type: Boolean,
      required: false,
      default: false,
    },
    track: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isAvatarHovered: false,
      avatarImage: null,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
    isAvatarWithImageAndDisabledForUpload() {
      return this.$props.avatarSrc && !(this.isAvatarHovered && this.$props.isEnabledForUploading);
    },
    isCommonFileInputVisible() {
      return (this.$props.isEnabledForUploading && !this.$props.avatarSrc) || (this.$props.isEnabledForUploading && this.isAvatarHovered);
    },
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setTrackColor"]),
    userPictureURI() {
      return this.user?.pictureURI;
    },
    handleAvatarUpload(file) {
      this.$eventBus.emit("avatar-edited", file);
    },
    changeGetHeadersForImage() {
      this.$api.removeHeader("authorization");
    },
    restoreGetHeaders() {
      this.$api.autoConfigure();
    },
    async colorInputHandler(event) {
      if (!this.track) {
        return;
      }
      this.setTrackColor({
        commandArgs: {
          trackId: this.$props.track.id,
          primaryColor: event.target.value,
        },
        controllerOptions: { isOnChange: false },
      });
    },
    colorInputFocusHandler(event) {
      if (!this.track) {
        return;
      }
      this.isColorInputFocused = true;
      this.oldTrackPrimaryColor = event.target.value;
      this.$eventBus.emit("track-mixing-tools-color-input-focus-changed", true);
    },
    colorInputBlurHandler(event) {
      if (!this.track) {
        return;
      }
      this.isColorInputFocused = false;
      this.setTrackColor({
        commandArgs: {
          trackId: this.$props.track.id,
          primaryColor: event.target.value,
          oldPrimaryColor: this.oldTrackPrimaryColor,
        },
        controllerOptions: {
          isOnChange: true,
        },
      });
      this.$eventBus.emit("track-mixing-tools-color-input-focus-changed", false);
    },
  },
};
</script>

<style scoped>
.upload-image-block {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-green-light);

  cursor: pointer;
}

.upload-image-block svg {
  width: 44%;
  transition: 0.5s;
}
.upload-image-block svg:hover {
  scale: 1.1;
}
.profile-user-image-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--gradient-primary);
}

.profile-user-image-holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-avatar {
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--border-raduis-circle);
  overflow: hidden;

  position: relative;
}

.color-input-holder {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  overflow: hidden;
  width: 0;
  height: 0;
}
</style>
