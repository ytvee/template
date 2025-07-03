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
            <input v-model="textFields.nameField" type="text" placeholder="Example" :class="{ error: !visibleValidity.nameField }" />
          </div>
          <div class="field">
            <h4>Artist type</h4>
            <div class="dropdown-select-wrapper">
              <DropdownSelect :selected-option="currentArtist.type" />
            </div>
          </div>
          <div class="field description">
            <h4>Description</h4>
            <textarea v-model="textFields.descriptionField" placeholder="Email@example.com" :class="{ error: !visibleValidity.descriptionField }" />
          </div>
        </div>
      </div>
      <div class="container-text">
        <div class="header-holder">
          <h3>Social links</h3>
        </div>
        <div class="social-list-inputs-list-wrapper">
          <SocialLinkInputsList :initial-links="initialArtist?.links" />
        </div>
      </div>
    </div>
    <div class="container-gallery">
      <div class="header-holder">
        <h3>Gallery</h3>
      </div>
      <div class="photo-insert-wrapper">
        <EditableGallery input-id="SettingsArtistProfile" :initial-images="currentArtist.images" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import EditableGallery from "@/components/structure/user/general/imageManager/EditableGallery.vue";
import DropdownSelect from "@/components/common/navigation/dropdowns/DropdownSelect.vue";

import SocialLinkInputsList from "@/components/common/navigation/inputs/SocialLinkInputsList.vue";

export default {
  name: "SettingsAritstProfile",
  components: {
    EditableGallery,
    DropdownSelect,
    SocialLinkInputsList,
  },
  props: {
    currentArtist: {
      type: Object,
      required: true,
    },
    initialArtist: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      textFields: {
        nameField: "",
        descriptionField: "",
      },
      validity: {
        nameField: false,
        descriptionField: false,
      },
      visibleValidity: {
        nameField: true,
        descriptionField: true,
      },
    };
  },
  computed: {
    ...mapState(storeModules.USER, {}),
    initialArtistImagesList() {
      return this.$props.initialArtist?.images?.map((item) => {
        return { imgSrc: item.uri };
      });
    },
  },
  watch: {
    initialArtist: {
      handler(newInitialArtist) {
        this.textFields.nameField = newInitialArtist?.name || "";
        this.textFields.descriptionField = newInitialArtist?.description || "";
      },
      deep: true,
    },
    "textFields.nameField": {
      handler(newNameField) {
        this.validateName(newNameField);
        this.$eventBus.emit("text-fields-edited", [this.textFields, this.validity.nameField && this.validity.descriptionField]);
      },
    },
    "textFields.descriptionField": {
      handler(newDescriptionField) {
        this.validateDescription(newDescriptionField);
        this.$eventBus.emit("text-fields-edited", [this.textFields, this.validity.nameField && this.validity.descriptionField]);
      },
    },
  },
  methods: {
    validateName(nameField) {
      if (nameField === "") {
        this.validity.nameField = false;
        this.visibleValidity.nameField = false;
      } else {
        this.validity.nameField = true;
        this.visibleValidity.nameField = true;
      }
    },
    validateDescription(descriptionField) {
      if (descriptionField === "") {
        this.validity.descriptionField = false;
        this.visibleValidity.descriptionField = false;
      } else {
        this.validity.descriptionField = true;
        this.visibleValidity.descriptionField = true;
      }
    },
  },
};
</script>

<style scoped>
* {
  --vertical-space-between-fields: 2.3125rem;
  --field-min-width: calc(var(--medium-font-size) * 15);
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

.social-list-inputs-list-wrapper {
  max-height: 305px;
  overflow: auto;
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
.error {
  border-color: var(--color-error);
}

.field > :last-child {
  flex: 0 1 72.3%;
}

.field textarea {
  height: calc(var(--input-height) * 2 + var(--vertical-space-between-fields));
  /* min-height: calc(
    var(--input-height) * 2 + var(--vertical-space-between-fields)
  ); */
  min-height: 141px;
  max-height: calc(var(--input-height) * 4 + var(--vertical-space-between-fields) * 3);
}

/*gallery */
.container-gallery {
  display: flex;
  flex-direction: column;
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

.user-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--large-block-gap);
  max-height: 463px;
  overflow: auto;
}
</style>
