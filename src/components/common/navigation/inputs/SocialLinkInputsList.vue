<template>
  <div class="social-link-inputs-list">
    <div v-for="(link, index) in links" :key="index" class="link-item">
      <div class="link-icon-holder">
        <img :src="getImgUrl(links[index].linkIcon)" alt="" />
      </div>
      <input :key="index" v-model="links[index].content" type="text" class="input social-link-input" :class="{ error: !link.valid }" placeholder="Please enter your link" @input="handleInput($event, index)" />
      <div class="error-message">
        <p v-if="!link.valid">
          {{ messageErrorValid }}
        </p>
      </div>
      <div :style="getRemoveButtonHolderStyle(index)" class="remove-button-holder" @click="removeLink(index)">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 22.5C6.9875 22.5 2.5 18.0125 2.5 12.5C2.5 6.9875 6.9875 2.5 12.5 2.5C18.0125 2.5 22.5 6.9875 22.5 12.5C22.5 18.0125 18.0125 22.5 12.5 22.5ZM12.5 0C10.8585 0 9.23303 0.323322 7.71646 0.951506C6.19989 1.57969 4.8219 2.50043 3.66117 3.66117C1.31696 6.00537 0 9.18479 0 12.5C0 15.8152 1.31696 18.9946 3.66117 21.3388C4.8219 22.4996 6.19989 23.4203 7.71646 24.0485C9.23303 24.6767 10.8585 25 12.5 25C15.8152 25 18.9946 23.683 21.3388 21.3388C23.683 18.9946 25 15.8152 25 12.5C25 10.8585 24.6767 9.23303 24.0485 7.71646C23.4203 6.19989 22.4996 4.8219 21.3388 3.66117C20.1781 2.50043 18.8001 1.57969 17.2835 0.951506C15.767 0.323322 14.1415 0 12.5 0ZM6.25 13.75H18.75V11.25H6.25" fill="#DE3838" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
// import { BASE_ICONS_URI, LINK_ICONS } from "@/data/common/iconsData.json";
import ICONS_DATA from "@/data/common/iconsData.json";
export const SOCIAL_LINKS_INPUTS_LIST_ERRORS = {
  NO_ANY_LINKS: "no_any_links",
  OTHER: "other",
};
export default {
  name: "SocialLinkInputsList",
  props: {
    initialLinks: {
      type: Array,
      required: false,
      default: () => [
        {
          id: undefined,
          url: "",
        },
      ],
    },
    eventSuffix: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["links-edited"],
  data() {
    return {
      messageErrorValid: "Your link is not valid or exists",
      links: [
        {
          content: "",
          valid: true,
          domain: "web",
          linkIcon: ICONS_DATA.LINK_ICONS["web"].iconUrl,
        },
      ],
      emptyLink: {
        content: "",
        valid: true,
        domain: "web",
        linkIcon: ICONS_DATA.LINK_ICONS["web"].iconUrl,
      },
    };
  },
  computed: {
    lastInputIndex() {
      return this.links.length - 1;
    },
  },
  watch: {
    initialLinks: {
      handler(newInitialLinks) {
        this.initalizeLinksWithInitialLinks(newInitialLinks);
      },
      deep: true,
    },
    links: {
      handler(newLinks) {
        this.emitLinksEvent(newLinks);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    if (this.$props.initialLinks) {
      this.initalizeLinksWithInitialLinks(this.$props.initialLinks);
    }
  },
  methods: {
    isContainOnlyOneEmptyLink() {
      return this.links.length === 1 && this.links[0].content === "";
    },
    isRemoveButtonVisible(index) {
      return index !== this.lastInputIndex;
    },
    getImgUrl(url) {
      return ICONS_DATA.BASE_ICONS_URI + url;
    },
    findAndProcessDuplicatedLinks() {
      for (let indexOfLinkToCheck = 0; indexOfLinkToCheck < this.links.length; indexOfLinkToCheck++) {
        if (
          this.links.find((link, index) => {
            return indexOfLinkToCheck !== index && this.links[indexOfLinkToCheck].content === link.content;
          })
        ) {
          this.links[indexOfLinkToCheck].isDuplicated = true;
        } else {
          this.links[indexOfLinkToCheck].isDuplicated = false;
        }
      }
    },
    isWithInvalidItems(newLinksNoEmptyInputs) {
      return newLinksNoEmptyInputs.find((item) => !item.valid);
    },
    handleInput(event, index) {
      this.independentlyValidateLink(index);
      this.setLinkIcon(index);
      this.dependentlyValidateLinks();
      this.conjunctChecksToObtainValidFlag();
      if (this.isInputLastAndNotEmpty(index)) {
        this.pushNewInputToLinks();
      }
      this.removeIfEmptyLink(event, index);
    },
    pushNewInputToLinks() {
      this.links.push({
        content: "",
        valid: true,
        domain: "web",
        linkIcon: ICONS_DATA.LINK_ICONS["web"].iconUrl,
      });
    },
    isInputLastAndNotEmpty(index) {
      return this.links[index].content && this.lastInputIndex === index;
    },
    removeIfEmptyLink(event, index) {
      const item = event?.target;
      if (this.isContentEmptyAndLinkNotLast(index)) {
        this.blurItemIfNotPreLast(index, item);
        this.links.splice(index, 1);
      }
    },
    isContentEmptyAndLinkNotLast(index) {
      return this.links[index].content === "" && !(this.lastInputIndex === index);
    },
    blurItemIfNotPreLast(index, item) {
      if (index < this.lastInputIndex - 1) {
        item.blur();
      }
    },
    removeLink(index) {
      this.links.splice(index, 1);
      this.dependentlyValidateLinks();
      this.conjunctChecksToObtainValidFlag();
    },
    independentlyValidateLink(index) {
      if (!this.isValidRegex(this.links[index].content)) {
        this.links[index].isIndependentlyValid = false;
      } else {
        this.links[index].isIndependentlyValid = true;
      }
    },
    setLinkIcon(index) {
      const domain = this.getLinkDomain(this.links[index].content);
      if (!domain) {
        this.links[index].domain = "web";
        this.links[index].linkIcon = ICONS_DATA.LINK_ICONS["web"].iconUrl;
      } else {
        this.links[index].domain = domain;
        this.links[index].linkIcon = ICONS_DATA.LINK_ICONS[domain].iconUrl;
      }
    },
    dependentlyValidateLinks() {
      this.findAndProcessDuplicatedLinks();
    },
    conjunctChecksToObtainValidFlag() {
      this.links.forEach((item, index) => {
        if (!this.isLastEmptyLink(index)) {
          item.valid = item.isIndependentlyValid && !item.isDuplicated;
        } else {
          item.valid = true;
        }
      });
    },
    isLastEmptyLink(index) {
      return this.links[index].content === "" && this.links.length - 1 === index;
    },
    getLinkDomain(stringToExtractDomain) {
      for (let domain in ICONS_DATA.LINK_ICONS) {
        const isMatch = this.isStringMatchAnyRegexOfDomain(stringToExtractDomain, domain);
        if (isMatch) {
          return domain;
        }
      }
      return null;
    },
    isStringMatchAnyRegexOfDomain(stringToExtractDomain, domain) {
      for (let i = 0; i < ICONS_DATA.LINK_ICONS[domain].regexes.length; i++) {
        const regex = new RegExp(ICONS_DATA.LINK_ICONS[domain].regexes[i]);
        if (stringToExtractDomain && stringToExtractDomain.match(regex)) {
          return true;
        }
      }
      return false;
    },
    isValidRegex(stringToTest) {
      return /^(?:(?:ftp|https?):\/\/)?(?!0\.0\.0\.0$)(?:(?:(?:1?\d\d?|2[0-4]\d|25[0-5])(?:\.(?!$))?){4}|(?:[a-zA-Z\d]\.|[a-zA-Z\d](?:(?![-.]{2})[a-zA-Z\d-]){0,63}?[a-zA-Z\d]\.){1,63}?[a-z]{2,63})(?:[:/].*)?$/.test(stringToTest);
    },
    getRemoveButtonHolderStyle(index) {
      return this.isRemoveButtonVisible(index) ? "" : { visibility: "hidden" };
    },
    initalizeLinksWithInitialLinks(newInitialLinks) {
      if (newInitialLinks) {
        if (newInitialLinks.length) {
          this.links = newInitialLinks.map((item) => {
            return {
              id: item.id,
              content: item.url,
              valid: false,
              linkIcon: ICONS_DATA.LINK_ICONS["web"].iconUrl,
            };
          });
        } else {
          this.links = [];
          this.links.push(this.emptyLink);
        }
        for (let i = 0; i < this.links.length; i++) {
          this.handleInput(null, i);
        }
      }
    },
    emitLinksEvent(newLinks) {
      const newLinksNoEmptyInputs = newLinks.filter((item) => item.content !== "");
      const textContentLinksList = newLinksNoEmptyInputs.map((item) => {
        return { id: item.id, url: item.content, name: item.domain };
      });
      if (this.isWithInvalidItems(newLinksNoEmptyInputs) || this.isContainOnlyOneEmptyLink()) {
        this.$emit("links-edited", []); //TODO: remake this
      } else {
        this.$emit("links-edited", textContentLinksList);
      }
      if (this.isWithInvalidItems(newLinksNoEmptyInputs)) {
        this.$eventBus.emit("links-edited" + this.$props.eventSuffix, [textContentLinksList, false, SOCIAL_LINKS_INPUTS_LIST_ERRORS.OTHER]);
      } else if (this.isContainOnlyOneEmptyLink()) {
        this.$eventBus.emit("links-edited" + this.$props.eventSuffix, [textContentLinksList, false, SOCIAL_LINKS_INPUTS_LIST_ERRORS.NO_ANY_LINKS]);
      } else {
        this.$eventBus.emit("links-edited" + this.$props.eventSuffix, [textContentLinksList, true]);
      }
    },
  },
};
</script>
<style scoped>
.error {
  border-color: var(--color-error);
  transition: var(--default-transition);
}
.error-message {
  position: absolute;
  top: 45px;
  left: 50px;
  color: var(--color-error);
}

.link-item {
  display: flex;
  align-items: center;
  position: relative;
}

.link-item:not(:last-child) {
  margin-bottom: 30px;
}

.link-icon-holder {
  margin-right: 15px;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.link-icon-holder > img {
  width: 100%;
  height: 100%;
}

.social-link-input {
  max-width: 300px;
  padding-left: var(--regular-padding);
  margin-right: 20px;
  font-weight: var(--large-font-weight);
  transition: var(--default-transition);
}

.remove-button-holder {
  cursor: pointer;
}

.remove-button-holder:hover svg path {
  opacity: 50%;
}

.remove-button-holder:active svg path {
  opacity: 30%;
}
</style>
