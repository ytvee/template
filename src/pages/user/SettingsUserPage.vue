<template>
  <div class="settings-user-page">
    <ProfileHeader :is-user="true" :is-creator="isCreator" :is-user-card="false" :user="editedUser" :profile-edit-page="true" />
    <SettingsUserProfile :initial-user="currentUser" />
    <div class="container-buttons">
      <div class="button medium outlined accent" @click="goBack()">Cancel</div>
      <button class="button medium" :disabled="!isSaveable" @click="saveButtonHandler()">Save</button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import ProfileHeader from "@/components/common/headers/ProfileHeader.vue";
import SettingsUserProfile from "@/pages/user/SettingsUserProfile.vue";
import { mapState, mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import { SOCIAL_LINKS_INPUTS_LIST_ERRORS } from "@/components/common/navigation/inputs/SocialLinkInputsList.vue";

const IS_WITH_PAGE_LEAVE_GUARD = true;

export default {
  name: "SettingsUserPage",
  components: {
    ProfileHeader,
    SettingsUserProfile,
  },
  beforeRouteLeave(to, from, next) {
    // next(false);
    if (this.isNeedToConfirmLeavePage) {
      const isPageLeaveConfirmed = confirm("Your changes will be lost! Are you sure you want to leave the page?");
      if (!isPageLeaveConfirmed) {
        next(false);
      } else {
        this.unsetPageLeaveGuard();
        next();
      }
    } else {
      next();
    }
  },
  data() {
    return {
      editedUser: {},
      initialEditedUserData: { images: {} },
      editedUserData: { images: {} },
      validityOfCompletedFormFieldsForCreator: {
        textFields: false,
        links: false,
      },
      validityOfCompletedFormFieldsForUser: {
        textFields: false,
      },
    };
  },
  computed: {
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
      isLoggedIn: (state) => state.isLoggedIn,
    }),
    isCreator() {
      return this.currentUser?.roles?.includes("CREATOR");
    },
    isEditedUserDiffersFromUser() {
      return !_.isEqual(this.editedUserData, this.initialEditedUserData) || !_.isEqual(this.editedUser, this.currentUser);
    },
    isSaveable() {
      return this.isCreator ? this.isvalidityOfCompletedFormFieldsForCreator() && this.isEditedUserDiffersFromUser : this.isvalidityOfCompletedFormFieldsForUser() && this.isEditedUserDiffersFromUser;
    },
    isNeedToConfirmLeavePage() {
      return IS_WITH_PAGE_LEAVE_GUARD && this.isEditedUserDiffersFromUser && this.isLoggedIn;
    },
  },
  watch: {
    currentUser: {
      handler(newCurrentUser) {
        this.editedUser = JSON.parse(JSON.stringify(newCurrentUser));
        // this.unsetPageLeaveGuardOnLogout(newCurrentUser);
      },
      deep: true,
      immediate: true,
    },
    isNeedToConfirmLeavePage: {
      handler(newIsNeedToConfirmLeavePage) {
        if (!newIsNeedToConfirmLeavePage) {
          this.unsetPageLeaveGuard();
        } else {
          this.setPageLeaveGuard();
        }
      },
    },
  },
  created() {
    this.$eventBus.on("links-edited-settings-user-profile", this.changeLinksHandler);
  },
  mounted() {
    this.$eventBus.on("cover-edited", this.changeCoverHandler);
    this.$eventBus.on("avatar-edited", this.changeAvatarHandler);
    this.$eventBus.on("text-fields-edited", this.changeTextFieldsHandler);
  },
  methods: {
    ...mapActions("user", ["getUserFromBackend"]),
    changeCoverHandler(file) {
      this.editedUserData.images.coverImage = {
        file: file,
        metadata: { alt: file.name, format: this.getFileFormat(file.name) },
      };
      this.editedUser.coverURI = this.obtainImgURL(file);
    },
    changeAvatarHandler(file) {
      this.editedUserData.images.avatarImage = {
        file: file,
        metadata: { alt: file.name, format: this.getFileFormat(file.name) },
      };
      this.editedUser.logoURI = this.obtainImgURL(file);
    },
    changeLinksHandler([links, isLinksValid, linksErrorType]) {
      this.editedUser.links = links;
      this.validityOfCompletedFormFieldsForCreator.links = isLinksValid || linksErrorType === SOCIAL_LINKS_INPUTS_LIST_ERRORS.NO_ANY_LINKS;
    },
    changeTextFieldsHandler([textFields, isTextFieldsValid]) {
      this.editedUser.name = textFields.nameField;
      this.editedUser.description = textFields.descriptionField;
      this.validityOfCompletedFormFieldsForCreator.textFields = isTextFieldsValid;
      this.validityOfCompletedFormFieldsForUser.textFields = isTextFieldsValid;
    },
    getFileFormat(fileName) {
      return fileName?.split(".").pop();
    },
    obtainImgURL(file) {
      if (file) {
        if (file["imgSrc"]) {
          return file["imgSrc"];
        }
        return window.URL.createObjectURL(file);
      }
      return null;
    },
    goBack() {
      this.$router.back();
    },
    isvalidityOfCompletedFormFieldsForCreator() {
      return Object.values(this.validityOfCompletedFormFieldsForCreator).every((item) => {
        return item === true;
      });
    },
    isvalidityOfCompletedFormFieldsForUser() {
      return Object.values(this.validityOfCompletedFormFieldsForUser).every((item) => {
        return item === true;
      });
    },
    generateIdsForImages() {
      this.setImagesIdsInArrayRecursively(Object.values(this.editedUserData.images || {}));
    },
    setImagesIdsInArrayRecursively(imagesArray, counter = 0) {
      for (let i = 0; i < imagesArray.length; i++) {
        if (!Array.isArray(imagesArray[i])) {
          imagesArray[i].metadata.id = counter;
          counter++;
        } else {
          counter = this.setImagesIdsInArrayRecursively(imagesArray[i], counter);
        }
      }
      return counter;
    },
    isLinkNotInInitialUserLinks(link) {
      return !this.currentUser.links.find((linkInInitialUser) => {
        return link.url === linkInInitialUser.url;
      });
    },
    obtainAddedLinks() {
      return this.editedUser.links.filter((linkInEditedUser) => {
        return this.isLinkNotInInitialUserLinks(linkInEditedUser);
      });
    },
    formatLinksForPayload(links) {
      return links.map((item) => {
        return { url: item.url, name: item.name };
      });
    },
    obtainRemovedLinks() {
      return this.currentUser.links.filter((linkInInitialUser) => {
        return !this.editedUser.links.find((linkInEditedUser) => {
          return linkInEditedUser.url === linkInInitialUser.url;
        });
      });
    },
    getIdsOfLinks(links) {
      return links.map((link) => {
        return link.id;
      });
    },
    obtainPayloadForEditUser() {
      const payload = {
        user: {
          name: this.editedUser.name,
          description: this.editedUser.description,
          location: null,
          username: this.currentUser.username,
        },
        linksToRemove: this.getIdsOfLinks(this.obtainRemovedLinks()) || [],
        links: this.formatLinksForPayload(this.obtainAddedLinks()) || [],
        metadata: {
          images: {},
        },
      };
      if (this.editedUserData.images?.avatarImage?.metadata) {
        payload.metadata.logo = this.editedUserData.images?.avatarImage?.metadata;
      }
      if (this.editedUserData.images?.coverImage?.metadata) {
        payload.metadata.cover = this.editedUserData.images?.coverImage?.metadata;
      }
      return payload;
    },
    isResponceGoodAndHavePresignedLinks(resdataEditUser) {
      return resdataEditUser && Array.isArray(resdataEditUser.data.presigned_links) && resdataEditUser.data.presigned_links.length;
    },
    async getResdataEditUser() {
      this.generateIdsForImages();
      const payload = this.obtainPayloadForEditUser();
      let resdataEditUser;
      try {
        const result = await this.$api.user.editUser(payload);
        resdataEditUser = result.data;
      } catch (error) {
        const message = error?.response?.data?.error?.message;
        throw new Error(message);
      }
      return resdataEditUser;
    },
    obtainFormData(imageFile, presignedLink) {
      const formData = new FormData();
      formData.append("key", presignedLink.fields.key);
      formData.append("AWSAccessKeyId", presignedLink.fields.AWSAccessKeyId);
      formData.append("x-amz-security-token", presignedLink.fields["x-amz-security-token"]);
      formData.append("policy", presignedLink.fields.policy);
      formData.append("signature", presignedLink.fields.signature);
      formData.append("file", imageFile.file);
      return formData;
    },
    async uploadImageViaPresignedLink(imageFile, presignedLinks) {
      const presignedLink = presignedLinks.find((item) => {
        return item.id === imageFile.metadata.id;
      });
      const formData = this.obtainFormData(imageFile, presignedLink);
      const responseUploadImage = await this.$api.artist.uploadImageViaPresignedURL(presignedLink.url, formData);
    },
    async callOnEachImageInImagesObjectRecursively(imagesArray, uploadImageViaPresignedLinkCallBack, uploadImageViaPresignedLinkArgs) {
      for (let i = 0; i < Object.values(imagesArray).length; i++) {
        if (!Array.isArray(imagesArray[i])) {
          await uploadImageViaPresignedLinkCallBack(imagesArray[i], ...uploadImageViaPresignedLinkArgs);
        } else {
          await this.callOnEachImageInImagesObjectRecursively(imagesArray[i], uploadImageViaPresignedLinkCallBack, uploadImageViaPresignedLinkArgs);
        }
      }
    },
    changePostHeadersForAmazonStorage() {
      this.$api.removeHeader("Authorization");
      this.$api.setHeader("content-type", "multipart/form-data");
      // this.$api.setHeader("cache-control", "no-cache");
    },
    restorePostHeaders() {
      this.$api.setHeader("content-type", "application/json");
      // this.$api.removeHeader("cache-control");
      this.$api.autoConfigure();
    },
    async uploadImages(resdataEditUser) {
      if (this.isResponceGoodAndHavePresignedLinks(resdataEditUser)) {
        try {
          this.changePostHeadersForAmazonStorage();
          await this.callOnEachImageInImagesObjectRecursively(Object.values(this.editedUserData.images), this.uploadImageViaPresignedLink, [resdataEditUser.data.presigned_links]);
          this.restorePostHeaders();
        } catch (error) {
          this.restorePostHeaders();
          throw error;
        }
      }
    },
    async updateUserFromBackend() {
      await this.getUserFromBackend();
    },
    async reseteditedUserDataAndReloadUserFromBackend() {
      this.editedUserData = JSON.parse(JSON.stringify(this.initialEditedUserData));
      await this.updateUserFromBackend();
    },
    callApiEditUser() {
      this.$load(async () => {
        const resdataEditUser = await this.getResdataEditUser();
        await this.uploadImages(resdataEditUser);
        const delay = (delayInms) => {
          return new Promise((resolve) => setTimeout(resolve, delayInms));
        };
        await delay(5000);
        await this.reseteditedUserDataAndReloadUserFromBackend();
        // this.restoreAfterSave(); //Use this method if you want to stay at SettingsArtistPage after click save button
        // this.unsetPageGuards(); //TODO:

        // this.$router.push("/artist/" + this.artistId); //TODO:
      });
    },
    saveButtonHandler() {
      this.callApiEditUser();
    },
    setPageLeaveGuard() {
      if (IS_WITH_PAGE_LEAVE_GUARD) {
        window.onbeforeunload = function () {
          return "Data has been modified. Do you sure to leave?";
        };
      }
    },
    unsetPageLeaveGuard() {
      window.onbeforeunload = null;
    },
    // unsetPageLeaveGuardOnLogout(newCurrentUser) {
    //   if (!newCurrentUser) {

    //   }
    //   console.log(
    //     "unsetPageLeaveGuardOnLogout: newCurrentUser=",
    //     newCurrentUser
    //   );
    // },
  },
};
</script>

<style>
/* container-buttons */
.container-buttons {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  row-gap: var(--vertical-space-between-wrapped-elements);
  padding-bottom: 1rem;
}

.container-buttons > * {
  margin-right: 3.21%;
}
</style>
