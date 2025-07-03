<template>
  <div class="artist-data-edit">
    <div class="header-holder">
      <h2>Settings</h2>
    </div>
    <div class="section-text-data-edit">
      <div class="container-text">
        <div class="header-holder">
          <h3>Account settings</h3>
        </div>
        <div class="line-green" />
        <div class="container-text-fields">
          <div class="field">
            <h4>Nickname</h4>
            <input v-model="textFields.nameField" type="text" placeholder="Example" :class="{ error: !visibleValidity.nameField }" />
          </div>
          <div v-if="isInitialUserCreator" class="field description">
            <h4>Bio</h4>
            <textarea v-model="textFields.descriptionField" placeholder="Enter your bio" :class="{ error: !visibleValidity.descriptionField }" />
          </div>
        </div>
      </div>
      <div v-if="isInitialUserCreator" class="container-text">
        <div class="header-holder">
          <h3>Social links</h3>
        </div>
        <div class="line-green" />
        <div class="container-text-fields">
          <div class="social-list-inputs-list-wrapper">
            <SocialLinkInputsList :initial-links="initialUser?.links" event-suffix="-settings-user-profile" />
          </div>
        </div>
      </div>
      <div class="web3auth-settings">
        <div class="header-holder">
          <h3>Web3Auth</h3>
        </div>
        <div class="line-green" />
        <div class="web3auth-control-pannel-wrapper"></div>
        <Web3AuthControlPannel />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import SocialLinkInputsList from "@/components/common/navigation/inputs/SocialLinkInputsList.vue";
import Web3AuthControlPannel from "@/components/structure/web3auth/Web3AuthControlPannel.vue";

export default {
  names: "SettingsUserProfile",
  components: {
    SocialLinkInputsList,
    Web3AuthControlPannel,
  },
  props: {
    initialUser: {
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
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
    isInitialUserCreator() {
      const res = this.$props.initialUser?.roles?.includes("CREATOR");
      return res;
    },
  },
  watch: {
    initialUser: {
      handler(newInitialUser) {
        this.textFields.nameField = newInitialUser?.name || "";
        this.textFields.descriptionField = newInitialUser?.description || "";
      },
      deep: true,
    },
    "textFields.nameField": {
      handler(newNameField) {
        this.validateName(newNameField);
        this.prepairEmptyFieldsAndEmitEvent();
      },
    },
    "textFields.descriptionField": {
      handler(newDescriptionField) {
        this.validateDescription(newDescriptionField);
        this.prepairEmptyFieldsAndEmitEvent(newDescriptionField);
      },
    },
  },
  mounted() {
    this.textFields.nameField = this.$props.initialUser.name || "";
    this.textFields.descriptionField = this.$props.initialUser.description || "";
    this.validateName();
    this.validateDescription();
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
      this.validity.descriptionField = true; //Description field checks should be here
    },
    prepairEmptyFieldsAndEmitEvent() {
      if (this.textFields.descriptionField === "") {
        this.textFields.descriptionField = null;
      }
      this.$eventBus.emit("text-fields-edited", [this.textFields, this.validity.nameField && this.validity.descriptionField]);
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
  margin-bottom: 15px;
}

.social-list-inputs-list-wrapper {
  max-height: 240px;
  overflow: auto;
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
  /* min-height: calc(
    var(--input-height) * 3.8 + var(--vertical-space-between-fields)
  ); */
  min-height: 158px;
  max-height: calc(var(--input-height) * 4 + var(--vertical-space-between-fields) * 3);
}
.line-green {
  border-top: 2px solid var(--color-accent-primary);
  margin-bottom: 25px;
}

.error {
  border-color: var(--color-error);
}
</style>
