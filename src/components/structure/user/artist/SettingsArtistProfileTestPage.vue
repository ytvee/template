<template>
  <div class="artist-data-edit">
    <div class="section-text-data-edit">
      <div class="container-text">
        <div class="header-holder">
          <h3>Information</h3>
        </div>
        <div class="container-text-fields">
          <div class="field">
            <h4>Nickname</h4>
            <input v-model="currentUser.name" type="text" placeholder="Example" />
          </div>
          <div class="field">
            <h4>Artist type</h4>
            <div class="dropdown-select-wrapper">
              <DropdownSelect />
            </div>
          </div>
          <div class="field description">
            <h4>Description</h4>
            <textarea v-model="currentUser.bioInformation" placeholder="Email@example.com" />
          </div>
        </div>
      </div>
      <div class="container-text">
        <div class="header-holder">
          <h3>Social links</h3>
        </div>
        <div class="container-text-fields">
          <div v-for="socialLink in Object.keys(userLinks)" :key="socialLink" class="field">
            <h4>{{ socialLink }}</h4>
            <input v-model="userLinks[socialLink]" type="text" placeholder="Link is not set" />
          </div>
        </div>
      </div>
    </div>
    <div class="container-gallery">
      <div class="header-holder">
        <h3>Gallery</h3>
      </div>
      <div class="photo-insert-wrapper">
        <PhotoInsert />
      </div>
      <div class="user-gallery-wrapper">
        <h4 class="header-user-gallery">Your photos</h4>
        <div class="user-gallery">
          <FileDisplay :files-array="currentArtist.gallery" />
        </div>
      </div>
    </div>

    <div class="container-buttons">
      <div class="button medium outlined accent" @click="goBack()">Cancel</div>
      <div class="button medium" @click="goBack()">Save</div>
    </div>
  </div>

  <PreviewCardForCreator v-for="artist in artists" :key="artist.id" :artist="artist" :is-artist-card="false" />
  <AcceptForm />
  <RoleTag />
  <RolesList />
  <SocialLinksList />
  <AddUser />
  <ChoseAccount />
  <ChoseRoleForm />
  <EditMember />
  <FindUser />
  <RolesSelector />
  <UsersList />
</template>

<script>
import PreviewCardForCreator from "@/components/structure/user/artist/preview/PreviewCardForCreator.vue";
import AcceptForm from "@/components/structure/roleForm/acceptPerson/AcceptForm.vue";
import RoleTag from "@/components/structure/roleForm/acceptPerson/RoleTag.vue";
import RolesList from "@/components/structure/roleForm/acceptPerson/RolesList.vue";
import SocialLinksList from "@/components/structure/roleForm/acceptPerson/SocialLinksList.vue";
import AddUser from "@/components/structure/roleForm/AddUserModal.vue";
import ChoseAccount from "@/components/structure/roleForm/ChoseAccount.vue";
import ChoseRoleForm from "@/components/structure/roleForm/ChoseRoleForm.vue";
import EditMember from "@/components/structure/roleForm/EditMember.vue";
import FindUser from "@/components/structure/roleForm/FindUser.vue";
import RolesSelector from "@/components/structure/roleForm/RolesSelector.vue";
import UsersList from "@/components/structure/roleForm/FindAndAddUserModal/UsersList.vue";

import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import PhotoInsert from "@/components/structure/user/general/imageManager/EditableGallery.vue";
import DropdownSelect from "@/components/common/navigation/dropdowns/DropdownSelect.vue";
import FileDisplay from "@/components/structure/user/general/imageManager/PhotoInsert/FileDisplay.vue";

export default {
  name: "SettingsAritstProfile",
  components: {
    PreviewCardForCreator,
    AcceptForm,
    RoleTag,
    RolesList,
    SocialLinksList,
    AddUser,
    ChoseAccount,
    ChoseRoleForm,
    EditMember,
    FindUser,
    RolesSelector,
    UsersList,

    PhotoInsert,
    FileDisplay,
    DropdownSelect,
  },
  data() {
    return {
      userLinks: {
        Twitter: "",
        Facebook: "",
        Instagram: "",
        Web: "",
      },
    };
  },
  computed: {
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
};
</script>

<style scoped>
* {
  --vertical-space-between-fields: 2.3125rem;
  --field-min-width: calc(var(--input-font-size) * 15);
  /* min-width of field*/
  --horizontal-space-between-files: 3.8%;
  --vertical-space-between-wrapped-elements: 1rem;

  /*calculated*/
  --horizontal-space-between-fields-adjusted: calc();
}

.artist-data-edit {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.section-text-data-edit {
  display: flex;
  justify-content: space-between;
  column-gap: min(max(0px, calc(100% - var(--field-min-width) * 2)), 4.2%);
  /*piecewise function */

  flex-wrap: wrap;
}

.container-text {
  flex: 1 1 47.9%;
  display: flex;
  flex-direction: column;
}

.header-holder {
  margin-bottom: var(--vertical-space-between-fields);
}

.container-text-fields {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.field {
  min-width: var(--field-min-width);
  margin-bottom: var(--vertical-space-between-fields);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field.description {
  align-items: flex-start;
}

.field > :first-child {
  min-width: calc(var(--h4-font-size) * 6);
  /* width: max(calc(var(--h4-font-size)*5), 20%); */
  /* flex-shrink: 0; */
}

.field.description > :first-child {
  line-height: var(--input-height);
}

.field > :last-child {
  flex: 0 1 72.3%;
}

.field textarea {
  height: calc(var(--input-height) * 2 + var(--vertical-space-between-fields));
  min-height: calc(var(--input-height) * 2 + var(--vertical-space-between-fields));
  /* min-height: 141px; */
  max-height: calc(var(--input-height) * 4 + var(--vertical-space-between-fields) * 3);
}

/*gallery */
.container-gallery {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
}

.container-gallery-file-inputs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: var(--vertical-space-between-wrapped-elements);
}

.photo-insert-wrapper {
  width: 100%;
  display: flex;
  margin-bottom: var(--vertical-space-between-fields);
}

.user-gallery-wrapper,
.header-user-gallery {
  margin-bottom: var(--vertical-space-between-fields);
}

.user-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--large-block-gap);
  max-height: 463px;
  overflow: auto;
}

/* container-buttons */
.container-buttons {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  row-gap: var(--vertical-space-between-wrapped-elements);
}

.container-buttons > * {
  margin-right: 3.21%;
}

.accent {
  color: var(--color-accent-primary) !important;
  -webkit-text-fill-color: unset !important;
}
</style>
