<template>
  <div class="settings-artist-page">
    <ProfileHeader :is-settings-artist-page="true" :user="editedArtist" />
    <div class="tabbed-pane-wrapper">
      <TabbedPane>
        <DynamicTab label="Profile" :is-updating="isDataUpdating">
          <SettingsArtistProfile :current-artist="editedArtist" :initial-artist="obtainInitialArtist" />
        </DynamicTab>
        <DynamicTab label="Team" :is-updating="isDataUpdating">
          <SettingsArtistTeam :current-artist="editedArtist" />
        </DynamicTab>
      </TabbedPane>
    </div>

    <div class="container-buttons">
      <div class="button medium outlined accent" @click="goBack()">Cancel</div>
      <button class="button medium" :disabled="!isSaveable" @click="saveButtonHandler()">Save</button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";
import routerPathes from "@/data/router/path/routerPaths.json";
import storeModules from "@/data/store/storeModules.json";
import userActions from "@/data/store/user/userActions.json";
import dataGetters from "@/data/store/data/dataGetters.json";
import dataActions from "@/data/store/data/dataActions.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import { LocalStorageKeys } from "@/utils/constants/constants";
import ProfileHeader from "@/components/common/headers/ProfileHeader.vue";
import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import SettingsArtistProfile from "@/components/structure/user/artist/SettingsArtistProfile.vue";
import SettingsArtistTeam from "@/components/structure/user/artist/SettingsArtistTeam.vue";

const IS_CACHE_NEW_ARTIST = true;
const IS_WITH_PAGE_LEAVE_GUARD = true;
export default {
  name: "SettingsArtistPage",
  components: {
    ProfileHeader,
    TabbedPane,
    DynamicTab,
    SettingsArtistProfile,
    SettingsArtistTeam,
  },
  beforeRouteLeave(to, from, next) {
    // next(false);
    if (this.isNeedToConfirmLeavePage) {
      const isPageLeaveConfirmed = confirm("Your changes will be lost! Are you sure you want to leave the page?");
      if (!isPageLeaveConfirmed) {
        next(false);
      } else {
        this.unsetPageGuard();
        next();
      }
    } else {
      next();
    }
  },
  data() {
    return {
      artistId: this.$route.params.id,
      isDataUpdating: false,
      artist: { links: [] },
      artistDraftFromStorage: {},
      editedArtist: { links: [] },
      initialEditedArtistData: { images: {} },
      editedArtistData: { images: {} },
      validityOfCompletedFormFields: {
        coverURI: false,
        logoURI: false,
        type: false,
        textFields: false,
        links: false,
        images: false,
      },
      isAfterSave: false,
    };
  },
  computed: {
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
    ...mapState(storeModules.DATA, {
      cachedArtistData: (state) => state.cachedArtistData,
    }),
    ...mapGetters(storeModules.DATA, [dataGetters.IS_ARTIST_CACHED]),
    isEditedArtistDiffersFromArtist() {
      return !_.isEqual(this.editedArtistData, this.initialEditedArtistData) || !_.isEqual(this.editedArtist, this.artist);
    },
    isNeedToConfirmLeavePage() {
      return IS_WITH_PAGE_LEAVE_GUARD && this.isEditedArtistDiffersFromArtist && !this.isAfterSave;
    },
    isSaveable() {
      return this.isValidityOfCompletedFormFields() && this.isEditedArtistDiffersFromArtist;
    },
    obtainInitialArtist() {
      return this.artistId ? this.artist : this.artistDraftFromStorage;
    },
  },
  watch: {
    editedArtist: {
      handler(newEditedArtist) {
        this.validateEditedArtist(newEditedArtist);
        this.saveArtistToCache(newEditedArtist);
      },
      deep: true,
    },
    isEditedArtistDiffersFromArtist: {
      handler(newIsEditedArtistDiffersFromArtist) {
        if (newIsEditedArtistDiffersFromArtist) {
          this.setPageLeaveGuard();
        }
      },
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
  mounted() {
    this.$eventBus.on("cover-edited", this.changeCoverHandler);
    this.$eventBus.on("avatar-edited", this.changeAvatarHandler);
    this.$eventBus.on("artist-type-edited", this.changeArtistTypeHandler);
    this.$eventBus.on("links-edited", this.changeLinksHandler);
    this.$eventBus.on("text-fields-edited", this.changeTextFieldsHandler);
    this.$eventBus.on("added-files-array-edited", this.addGalleryPhotosHandler);
    this.$eventBus.on("remove-image-from-gallery", this.removeImageFromGalleryHandler);

    this.$eventBus.on("change-members-event", this.changeMembersHandler); //Find user form
    this.$eventBus.on("change-moderator-added-user-event", this.changeModeratorAddedUser);
    this.$eventBus.on("remove-added-user-event", this.removeAddedUser);
    this.$eventBus.on("change-moderator-confirmed-user-event", this.changeModeratorConfirmedUser);
    this.$eventBus.on("remove-confirmed-user-event", this.removeConfirmedUser);

    if (this.artistId) {
      this.loadExistingArtistById();
    } else {
      this.loadNewArtistFromLocalStorageIfExists();
      this.prepairNewArtistForEditing();
    }
    this.scrollAppContentToTop();
  },

  methods: {
    ...mapActions(storeModules.USER, [userActions.SET_IS_AFTER_ARTIST_CREATION]),
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_IS_LOADING]),
    ...mapActions(storeModules.DATA, [dataActions.CACHE_ARTIST]),
    scrollAppContentToTop() {
      const appContent = document.querySelector(".content");
      appContent?.scrollTo(0, 0);
    },
    loadExistingArtistById(useLoadPlugin = true) {
      const loadPluginCallback = async () => {
        this.isDataUpdating = true;
        //temp disable
        //TODO: fix constant
        const valFalse = false;
        if (this[dataGetters.IS_ARTIST_CACHED](this.artistId) && valFalse) {
          this.getArtistFromCache();
        } else {
          await this.getArtistFromBackend();
        }
        this.prepairExistingArtistForEditing();

        this.isDataUpdating = false;
      };
      if (!useLoadPlugin) {
        loadPluginCallback;
      } else {
        this.$load(loadPluginCallback);
      }
    },
    prepairExistingArtistForEditing() {
      const currentUserIndex = this.artist.members.findIndex((item) => {
        return item.id === this.currentUser.id;
      });
      if (currentUserIndex === -1) {
        console.error("Artist is editing by user which is not member of artist team!");
      } else {
        this.artist.members[currentUserIndex].isCurrentUser = true;
      }
      this.editedArtist = JSON.parse(JSON.stringify(this.artist));
      this.validateArtistGallery();
    },
    prepairNewArtistForEditing() {
      this.editedArtist.members = [];
      const currentUserForMembersList = JSON.parse(JSON.stringify(this.currentUser));
      currentUserForMembersList.isCurrentUser = true;
      currentUserForMembersList.moderator = true;
      this.editedArtist.members.push(currentUserForMembersList);
      this.artist.members = [];
      this.artist.members.push(currentUserForMembersList);
    },
    unsetPageGuard() {
      this.unsetPageLeaveGuard();
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
    saveArtistToCache(editedArtist) {
      let artistWithNoImages = JSON.parse(JSON.stringify(editedArtist));
      delete artistWithNoImages.coverURI;
      delete artistWithNoImages.logoURI;
      delete artistWithNoImages.members;
      if (artistWithNoImages.name === "") {
        delete artistWithNoImages.name;
      }
      if (artistWithNoImages.description === "") {
        delete artistWithNoImages.description;
      }

      if (!this.artistId && IS_CACHE_NEW_ARTIST) {
        sessionStorage.setItem(LocalStorageKeys.NEW_ARTIST, JSON.stringify(artistWithNoImages));
      }
    },
    getArtistFromCache() {
      this.artist = this.cachedArtistData.artist;
    },
    async getArtistFromBackend() {
      const { data: resdata } = await this.$api.artist.getArtist(this.artistId);
      const artist = resdata?.data?.artist;
      this.artist = artist;

      this[dataActions.CACHE_ARTIST]({ artist: artist });
    },
    loadNewArtistFromLocalStorageIfExists() {
      if (!IS_CACHE_NEW_ARTIST || !sessionStorage.getItem(LocalStorageKeys.NEW_ARTIST)) {
        return;
      }
      this.editedArtist = JSON.parse(sessionStorage.getItem(LocalStorageKeys.NEW_ARTIST));
      this.artistDraftFromStorage = JSON.parse(sessionStorage.getItem(LocalStorageKeys.NEW_ARTIST));
    },
    goBack() {
      this.$router.back();
    },

    getFileFormat(fileName) {
      return fileName?.split(".").pop();
    },
    changeCoverHandler(file) {
      this.editedArtistData.images.coverImage = {
        file: file,
        metadata: { alt: file.name, format: this.getFileFormat(file.name) },
      };

      this.editedArtist.coverURI = this.obtainImgURL(file);
    },
    changeAvatarHandler(file) {
      this.editedArtistData.images.avatarImage = {
        file: file,
        metadata: { alt: file.name, format: this.getFileFormat(file.name) },
      };
      this.editedArtist.logoURI = this.obtainImgURL(file);
    },
    changeArtistTypeHandler(artistType) {
      this.editedArtist.type = artistType;
    },
    changeLinksHandler([links, isLinksValid]) {
      this.editedArtist.links = links;
      this.validityOfCompletedFormFields.links = isLinksValid;
    },
    changeTextFieldsHandler([textFields, isTextFieldsValid]) {
      this.editedArtist.name = textFields.nameField;
      this.editedArtist.description = textFields.descriptionField;
      this.validityOfCompletedFormFields.textFields = isTextFieldsValid;
    },
    changeMembersHandler(members) {
      this.editedArtist.addedMembers = [...members];
      if (!this.editedArtist.addedMembers.length) {
        delete this.editedArtist.addedMembers;
      }
    },
    changeModeratorAddedUser([moderator, userId]) {
      const userIndex = this.editedArtist.addedMembers.findIndex((item) => {
        return item.id === userId;
      });
      this.editedArtist.addedMembers[userIndex].moderator = moderator;
    },
    removeAddedUser(userId) {
      const userIndex = this.editedArtist.addedMembers.findIndex((item) => {
        return item.id === userId;
      });
      this.editedArtist.addedMembers.splice(userIndex, 1);
      if (!this.editedArtist.addedMembers.length) {
        delete this.editedArtist.addedMembers;
      }
    },
    changeModeratorConfirmedUser([moderator, userId]) {
      const userIndex = this.editedArtist.members.findIndex((item) => {
        return item.id === userId;
      });
      this.editedArtist.members[userIndex].moderator = moderator;
    },
    removeConfirmedUser(userId) {
      const userIndex = this.editedArtist.members.findIndex((item) => {
        return item.id === userId;
      });
      this.editedArtist.members.splice(userIndex, 1);
    },
    addGalleryPhotosHandler(filesArray) {
      this.editedArtistData.images.uploadedGalleryImages = filesArray.map((item) => {
        return {
          file: item,
          metadata: { alt: item.name, format: this.getFileFormat(item.name) },
        };
      });
      if (this.editedArtistData.images.uploadedGalleryImages.length === 0) {
        delete this.editedArtistData.images.uploadedGalleryImages;
      }
      this.validateArtistGallery();
    },
    removeImageFromGalleryHandler(index) {
      this.editedArtist.images.splice(index, 1);
      this.validateArtistGallery();
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
    validateEditedArtist(editedArtist) {
      editedArtist.coverURI ? (this.validityOfCompletedFormFields.coverURI = true) : (this.validityOfCompletedFormFields.coverURI = false);
      editedArtist.logoURI ? (this.validityOfCompletedFormFields.logoURI = true) : (this.validityOfCompletedFormFields.logoURI = false);
      editedArtist.type ? (this.validityOfCompletedFormFields.type = true) : (this.validityOfCompletedFormFields.type = false);
    },
    validateArtistGallery() {
      this.validityOfCompletedFormFields.images = Boolean(this.editedArtistData.images?.uploadedGalleryImages?.length || this.editedArtist.images?.length);
    },
    isValidityOfCompletedFormFields() {
      return Object.values(this.validityOfCompletedFormFields).every((item) => {
        return item === true;
      });
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
    async callOnEachImageInImagesObjectRecursively(imagesArray, uploadImageViaPresignedLinkCallBack, uploadImageViaPresignedLinkArgs) {
      for (let i = 0; i < Object.values(imagesArray).length; i++) {
        if (!Array.isArray(imagesArray[i])) {
          await uploadImageViaPresignedLinkCallBack(imagesArray[i], ...uploadImageViaPresignedLinkArgs);
        } else {
          await this.callOnEachImageInImagesObjectRecursively(imagesArray[i], uploadImageViaPresignedLinkCallBack, uploadImageViaPresignedLinkArgs);
        }
      }
    },
    generateIdsForImages() {
      this.setImagesIdsInArrayRecursively(Object.values(this.editedArtistData.images || {}));
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
    changePostHeadersForAmazonStorage() {
      this.$api.removeHeader("authorization");
      this.$api.setHeader("content-type", "multipart/form-data");
      // this.$api.setHeader("cache-control", "no-cache");
    },
    restorePostHeaders() {
      this.$api.setHeader("content-type", "application/json");
      // this.$api.removeHeader("cache-control");
      this.$api.autoConfigure();
    },
    obtainPayloadForCreateArtist() {
      return {
        artist: {
          type: this.editedArtist.type,
          name: this.editedArtist.name,
          description: this.editedArtist.description,
        },
        members: this.getMemberToAddForPayload(),
        links: this.editedArtist.links.map((item) => {
          return { url: item.url, name: item.name };
        }),
        metadata: {
          logo: this.editedArtistData.images.avatarImage?.metadata,
          cover: this.editedArtistData.images.coverImage?.metadata,
          images: this.editedArtistData.images.uploadedGalleryImages?.map((item) => {
            return item.metadata;
          }),
        },
      };
    },
    async getResdataCreateArtist() {
      this.generateIdsForImages();
      const payload = this.obtainPayloadForCreateArtist();

      let resdataCreateArtist;
      try {
        const result = await this.$api.artist.createArtist(payload);
        resdataCreateArtist = result.data;
      } catch (error) {
        const message = error?.response?.data?.error?.message;
        this.isDataUpdating = false;
        throw new Error(message);
      }
      return resdataCreateArtist;
    },
    async uploadImages(resdata) {
      if (resdata && Array.isArray(resdata.data.presigned_links) && resdata.data.presigned_links.length) {
        try {
          this.changePostHeadersForAmazonStorage();
          await this.callOnEachImageInImagesObjectRecursively(Object.values(this.editedArtistData.images), this.uploadImageViaPresignedLink, [resdata.data.presigned_links]);
          this.restorePostHeaders();
        } catch (error) {
          this.restorePostHeaders();
          throw error;
        }
      }
    },
    callApiCreateArtist() {
      this.$load(async () => {
        this.isDataUpdating = true;
        const resdataCreateArtist = await this.getResdataCreateArtist();
        await this.uploadImages(resdataCreateArtist);
        this.unsetPageGuard();
        this.isAfterSave = true;
        const delay = (delayInms) => {
          return new Promise((resolve) => setTimeout(resolve, delayInms));
        };
        await delay(5000);
        this.isDataUpdating = false;
        this[userActions.SET_IS_AFTER_ARTIST_CREATION](true);
        this.$router.push(routerPathes.MY_TEAMS);
        // this.openThankModal();
        //this.goToArtists();
      });
    },
    isLinkNotInInitialArtistLinks(link) {
      return !this.artist.links.find((linkInInitialArtist) => {
        return link.url === linkInInitialArtist.url;
      });
    },
    obtainAddedLinks() {
      return this.editedArtist.links.filter((linkInEditedArtist) => {
        return this.isLinkNotInInitialArtistLinks(linkInEditedArtist);
      });
    },
    obtainRemovedLinks() {
      return this.artist.links.filter((linkInInitialArtist) => {
        return !this.editedArtist.links.find((linkInEditedArtist) => {
          return linkInEditedArtist.url === linkInInitialArtist.url;
        });
      });
    },
    formatLinksForPayload(links) {
      return links.map((item) => {
        return { url: item.url, name: item.name };
      });
    },
    getIdsOfLinks(links) {
      return links.map((link) => {
        return link.id;
      });
    },
    getMemberToAddForPayload() {
      return (
        this.editedArtist.addedMembers?.map((item) => {
          return { id: item.id, moderator: item.moderator || false };
        }) || []
      );
    },
    getMembersIdsToRemove() {
      const removedUsers = this.artist.members.filter((artistMembersItem) => {
        return !this.editedArtist.members.find((editedArtistMembersItem) => {
          return editedArtistMembersItem.id === artistMembersItem.id;
        });
      });
      return removedUsers.map((item) => {
        return item.id;
      });
    },
    getMembersToEditProfileInTeam() {
      const editedUsers = this.editedArtist.members.filter((editedArtistMembersItem) => {
        return this.artist.members.find((artistMembersItem) => {
          return editedArtistMembersItem.id === artistMembersItem.id && editedArtistMembersItem.moderator !== artistMembersItem.moderator;
        });
      });
      return editedUsers.map((item) => {
        return { id: item.id, isModerator: item.moderator };
      });
    },
    getImagesIdsForRemove() {
      const removedImages = this.artist.images?.filter((initialArtistImage) => {
        return !this.editedArtist.images?.find((editedArtistImage) => {
          return initialArtistImage.id === editedArtistImage.id;
        });
      });
      return removedImages?.map((item) => item.uri) || [];
    },
    obtainPayloadForEditArtist() {
      const payload = {
        artist: {
          type: this.editedArtist.type,
          name: this.editedArtist.name,
          description: this.editedArtist.description,
        },
        membersToRemove: this.getMembersIdsToRemove(),
        membersToEditProfileInTeam: this.getMembersToEditProfileInTeam(), //TODO:
        members: this.getMemberToAddForPayload(),
        linksToRemove: this.getIdsOfLinks(this.obtainRemovedLinks()) || [],
        links: this.formatLinksForPayload(this.obtainAddedLinks()) || [],
        metadata: {
          imagesToRemove: this.getImagesIdsForRemove(),
        },
      };
      if (this.editedArtistData.images?.avatarImage?.metadata) {
        payload.metadata.logo = this.editedArtistData.images?.avatarImage?.metadata;
      }
      if (this.editedArtistData.images?.coverImage?.metadata) {
        payload.metadata.cover = this.editedArtistData.images?.coverImage?.metadata;
      }
      if (this.editedArtistData.images?.uploadedGalleryImages) {
        payload.metadata.images = this.editedArtistData.images?.uploadedGalleryImages?.map((item) => {
          return item.metadata;
        });
      }
      return payload;
    },
    async getResdataEditArtist() {
      this.generateIdsForImages();
      const payload = this.obtainPayloadForEditArtist();

      let resdataEditArtist;
      try {
        const result = await this.$api.artist.editArtist(this.artistId, payload);
        resdataEditArtist = result.data;
      } catch (error) {
        const message = error?.response?.data?.error?.message;
        this.isDataUpdating = false;
        throw new Error(message);
      }
      return resdataEditArtist;
    },
    callApiEditArtist() {
      this.$load(async () => {
        this.isDataUpdating = true;
        const resdataEditArtist = await this.getResdataEditArtist();
        await this.uploadImages(resdataEditArtist);
        // this.restoreAfterSave(); //Use this method if you want to stay at SettingsArtistPage after click save button
        this.unsetPageGuard();
        this.isAfterSave = true;
        const delay = (delayInms) => {
          return new Promise((resolve) => setTimeout(resolve, delayInms));
        };
        await delay(5000);
        this.isDataUpdating = false;
        this.$router.push("/artist/" + this.artistId);
      });
    },
    restoreAfterSave() {
      this.editedArtistData = JSON.parse(JSON.stringify(this.initialEditedArtistData));
      this.$eventBus.emit("reset-editable-gallery-after-save-artist");
      if (this.artistId) {
        this.loadExistingArtistById(true);
      }
    },
    saveButtonHandler() {
      this.unsetPageLeaveGuard();
      if (!this.artistId) {
        this.callApiCreateArtist();
      } else {
        this.callApiEditArtist();
      }
    },
  },
};
</script>

<style scoped>
.tabbed-pane-wrapper {
  margin-bottom: 48px;
}

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
