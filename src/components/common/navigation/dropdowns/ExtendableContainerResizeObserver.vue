<template>
  <div class="extendable-container">
    <div class="select-container" :class="({ active: isExtended }, usageVariant)" @click="toggleListActivation">
      <slot name="header" />
      <div class="arrow-holder">
        <svg v-if="usageVariant === USAGE_VARIANTS.WALLET_SECTION" class="wallet-section-arrow" width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.2925 0.0855254L-8.84104e-07 1.27373L5.5 6.33023L11 1.27372L9.7075 0.0855247L5.5 3.94527L1.2925 0.0855254ZM1.2925 5.14197L-4.4205e-07 6.33024L5.5 11.3867L11 6.33023L9.7075 5.14196L5.5 9.00173L1.2925 5.14197Z" fill="#D9D9D9" />
        </svg>
        <svg v-if="usageVariant === USAGE_VARIANTS.BLOCKCHAIN_WALLETS" width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.41 0L6 3.71159L10.59 0L12 1.14825L6 6L0 1.14825L1.41 0Z" fill="url(#paint0_linear_5194_6434)" />
          <defs>
            <linearGradient id="paint0_linear_5194_6434" x1="0.626865" y1="0.733333" x2="5.82325" y2="8.40142" gradientUnits="userSpaceOnUse">
              <stop stop-color="#677CEB" />
              <stop offset="1" stop-color="#90A1FC" stop-opacity="0.86" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <slot name="headerAdditional" />
    </div>
    <div ref="extendableContainerDropdown" class="extendable-container-dropdown with-transition" :class="{ scrollable: dropdownContainerMaxHeight !== undefined }">
      <div ref="extendableContainerInner">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
import { useResizeObserver } from "@vueuse/core";
import store from "@/store/store";

const EPSILON_PIXELS = 4.0;
const CURRENT_DEBUG_PREFIX = "nested";

const USAGE_VARIANTS = {
  DEFAULT_STYLE_VARIANT: "default-style-variant",
  WALLET_SECTION: "wallet-section",
  BLOCKCHAIN_WALLETS: "blockchain-wallets",
};

export default {
  name: "ExtendableContainer",
  // emits: ["adjusted"],
  props: {
    dropdownContainerMaxHeight: {
      type: Number,
      required: false,
      default: undefined,
    },
    usageVariant: {
      type: String,
      required: false,
      default: USAGE_VARIANTS.DEFAULT_STYLE_VARIANT,
    },
    debugPrefix: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      isExtended: true,
      requiredDropdownHeight: 0, //The height of full expanded dropdown
      USAGE_VARIANTS,

      resizeObserverCallbackFlag: true,
    };
  },
  watch: {
    isExtended(newIsExtended) {
      this.toggleDropdownContainerHeight(newIsExtended);
    },
  },
  mounted() {
    store.subscribeAction({
      //eslint-disable-next-line
      before: (action, store) => {
        if (action.type === "modal/setModalVisibility" && action.payload === false) {
          this.resizeObserverCallbackFlag = false;
        }
      },
      //eslint-disable-next-line
      after: (action, store) => {
        if (action.type === "modal/setModalVisibility" && action.payload === true) {
          this.resizeObserverCallbackFlag = true;
        }
      },
    });

    this.initializeResizeObserver();
    this.toggleDropdownContainerHeight(this.isExtended);
  },
  methods: {
    logIfPrefix() {
      if (this.$props.debugPrefix === CURRENT_DEBUG_PREFIX) {
        console.log(...arguments);
      }
    },
    toggleListActivation() {
      this.isExtended = !this.isExtended;
    },
    getHeightToSetByRequiredHeightAndMaxHeight(requiredHeight, maxHeight) {
      if (maxHeight === undefined) {
        return requiredHeight;
      }
      return requiredHeight <= maxHeight ? requiredHeight : maxHeight;
    },
    toggleDropdownContainerHeight(newIsExtended, extendableContainerInnerHeight = undefined) {
      //Need to write custom function for height transition. css transition leads to immediate transition in case when form was display: none then display: unset
      this.logIfPrefix(`${this.debugPrefix}: extendableContainerInnerHeight=`, extendableContainerInnerHeight);

      let heightToSet = undefined;
      if (newIsExtended) {
        if (extendableContainerInnerHeight !== undefined) {
          this.requiredDropdownHeight = extendableContainerInnerHeight + EPSILON_PIXELS;
        } else {
          this.requiredDropdownHeight = this.$refs.extendableContainerDropdown.scrollHeight + EPSILON_PIXELS;
        }
      } else {
        this.$refs.extendableContainerDropdown.classList.add("with-transition");
        this.requiredDropdownHeight = 0;
      }

      heightToSet = this.getHeightToSetByRequiredHeightAndMaxHeight(this.requiredDropdownHeight, this.$props.dropdownContainerMaxHeight);
      this.$refs.extendableContainerDropdown.style.height = heightToSet + "px";
    },
    initializeResizeObserver() {
      let timeout;
      let oldContentHeight;
      const resizeObserverCallback = (entries) => {
        if (this.resizeObserverCallbackFlag) {
          for (let entry of entries) {
            const contentRect = entry.contentRect;

            this.logIfPrefix("contentRect=", contentRect, "oldContentHeight=", oldContentHeight);
            if (oldContentHeight !== contentRect.height) {
              this.$refs.extendableContainerDropdown.classList.remove("with-transition");
              this.toggleDropdownContainerHeight(this.isExtended, contentRect.height);
            }
            oldContentHeight = contentRect.height;
            this.logIfPrefix("oldContentHeight=", oldContentHeight);

            timeout = null;
            timeout = setTimeout(() => {
              this.$refs.extendableContainerDropdown.classList.add("with-transition");
            }, 100);
          }
        }
      };
      const helperResizeObserverCallback = (entries) => {
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }
          resizeObserverCallback(entries);
        });
      };
      const extendableContainerInnerObserver = useResizeObserver(this.$refs.extendableContainerInner, (entries) => {
        helperResizeObserverCallback(entries);
      });
    },
  },
};
</script>

<style scoped>
.extendable-container {
  /* border: 1px solid blue; */
}

.select-container {
  display: flex;
  align-items: center;

  user-select: none;
  cursor: pointer;

  /* background: rgb(0, 128, 0); */
}

.select-container.active {
  /* background: rgb(0, 255, 0); */
}
.arrow-holder > svg {
  transition: var(--default-transition);
}
.active .arrow-holder > svg {
  transform: rotate(180deg);
  transition: var(--default-transition);
}
/* usage variants */
.select-container.wallet-section .arrow-holder {
  flex-grow: 1;
}
/* /usage varants */

.extendable-container-dropdown {
  will-change: height;
  overflow: hidden;
  /* background: rgb(255, 0, 255); */
}

.extendable-container-dropdown.with-transition {
  transition: height var(--default-transition);
}
.extendable-container-dropdown.scrollable {
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
</style>
