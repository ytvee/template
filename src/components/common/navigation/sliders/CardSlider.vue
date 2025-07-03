<template>
  <div ref="cardSliderRoot" class="card-slider" @wheel="scrollCards">
    <div ref="absoluteContainer" class="card-slider-absolute-positioned-container">
      <div class="card-wrapper card-dummy-first">
        <!-- card-dummy-first -->
      </div>
      <div v-for="(card, index) in cardsList" :key="index" class="card-wrapper">
        <TrackCard :data="card.data" />
      </div>
      <div ref="cardDummyLast" class="card-wrapper card-dummy-last" />
    </div>
    <div class="card-slider-arrows">
      <div class="arrow-holder" :class="{ 'arrow-inactive': isArrowLeftUnAvailable }" @click="scrollLeft">
        <ArrowLeft />
      </div>
      <div class="arrow-holder" :class="{ 'arrow-inactive': isArrowRightUnAvailable }" @click="scrollRight">
        <ArrowRight />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
import { useEventListener } from "@vueuse/core";
import TrackCard from "@/components/structure/user/artist/preview/TrackCard.vue";
import ArrowRight from "@/components/common/navigation/buttons/arrowButtons/ArrowRight.vue";
import ArrowLeft from "@/components/common/navigation/buttons/arrowButtons/ArrowLeft.vue";

const CARD_WIDTH = 348; //px
const CARD_GAP = 60; //px
const ACTIVE_CARD_OPACITY = 1;
const FADED_CARD_OPACITY = 0.6;
const INVISIBLE_CARD_OPACITY = 0;
const DELTA_ZERO_OPACITY = 0.005;
const INITIAL_CARD_CONTAINER_WIDTH = 326.2;

export default {
  name: "CardSlider",
  components: {
    TrackCard,
    ArrowRight,
    ArrowLeft,
  },
  props: {
    cardsList: {
      type: Array,
      required: true,
    },
  },
  setup() {
    let cardSliderRoot = getNullRef();
    let cardDummyLast = getNullRef();
    const cardSliderRootObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        onResize(entry);
      });
    });
    onBeforeUnmount(() => {
      cardSliderRootObserver.unobserve(cardSliderRoot.value);
    });
    function getNullRef() {
      return ref(null);
    }
    function onResize(cardSliderRootElement) {
      let cardSliderRootWidth = cardSliderRootElement.contentRect.width;
      if (cardSliderRootWidth - CARD_WIDTH <= 0) {
        setWidthInlineAttribute(cardDummyLast.value, 0);
      } else {
        setWidthInlineAttribute(cardDummyLast.value, cardSliderRootWidth - CARD_WIDTH);
      }
    }
    function setWidthInlineAttribute(element, value) {
      element.style.width = value + "px";
    }
    return {
      cardSliderRoot,
      cardDummyLast,
      cardSliderRootObserver,
    };
  },
  data() {
    return {
      currentScrollLeft: 0,
      currentCardIndex: 0,
      cardContainerWidth: INITIAL_CARD_CONTAINER_WIDTH,
    };
  },
  computed: {
    isArrowLeftUnAvailable() {
      return this.currentCardIndex === 0;
    },
    isArrowRightUnAvailable() {
      return this.currentCardIndex === this.lastIndex;
    },
    lastIndex() {
      return this.cardsList.length - 1;
    },
    calculatedWidthCards() {
      return this.cardContainerWidth * this.cardsList.length;
    },
  },
  mounted() {
    this.initializeResizeObserver();
    this.initializeScrollHandling();
  },
  methods: {
    initializeResizeObserver() {
      this.cardSliderRootObserver.observe(this.$refs.cardSliderRoot);
      const cardSliderRootWidth = this.$refs.cardSliderRoot.offsetWidth;
      this.setWidthInlineAttribute(this.$refs.cardDummyLast, cardSliderRootWidth - CARD_WIDTH);
    },
    setWidthInlineAttribute(element, value) {
      element.style.width = value + "px";
    },
    initializeScrollHandling() {
      useEventListener(this.$refs.absoluteContainer, "scroll", this.handleScroll);
      this.$refs.absoluteContainer.scrollTo(0, 0);
      this.handleScroll();
    },
    fadeRight(item, itemOffset, fadeLength) {
      let opacityValue = FADED_CARD_OPACITY;
      item.style.visibility = "";
      if (this.isInRightFadingArea(itemOffset, fadeLength)) {
        opacityValue = this.calculateOpacityValueOnRightFading(fadeLength, itemOffset);
      }
      item.style.opacity = opacityValue;
    },
    isInRightFadingArea(itemOffset, fadeLength) {
      return itemOffset <= fadeLength;
    },
    calculateOpacityValueOnRightFading(fadeLength, itemOffset) {
      return ((FADED_CARD_OPACITY - ACTIVE_CARD_OPACITY) / fadeLength) * itemOffset + ACTIVE_CARD_OPACITY;
    },
    fadeLeft(item, itemOffset, fadeLength) {
      let opacityValue = INVISIBLE_CARD_OPACITY;
      if (this.isInLeftFadingArea(itemOffset, fadeLength)) {
        opacityValue = this.calculateOpacityValueOnLeftFading(fadeLength, itemOffset);
      }
      item.style.opacity = opacityValue;
      if (opacityValue <= DELTA_ZERO_OPACITY) {
        item.style.visibility = "hidden";
      } else {
        item.style.visibility = "";
      }
    },
    isInLeftFadingArea(itemOffset, fadeLength) {
      return itemOffset >= -fadeLength;
    },
    calculateOpacityValueOnLeftFading(fadeLength, itemOffset) {
      return ((INVISIBLE_CARD_OPACITY - ACTIVE_CARD_OPACITY) / -fadeLength) * itemOffset + ACTIVE_CARD_OPACITY;
    },
    fadeItem(item) {
      const leftLengthForFade = CARD_WIDTH + CARD_GAP;
      const rightLengthForFade = CARD_WIDTH + CARD_GAP;
      const activeLeftPosition = this.$refs.absoluteContainer.scrollLeft + CARD_WIDTH + CARD_GAP;
      const itemOffset = item.offsetLeft - activeLeftPosition;
      if (this.isItemAtRightSideToActivePosition(itemOffset)) {
        this.fadeRight(item, itemOffset, rightLengthForFade);
      } else {
        this.fadeLeft(item, itemOffset, leftLengthForFade);
      }
    },
    isItemAtRightSideToActivePosition(itemOffset) {
      return itemOffset >= 0;
    },
    imitateScrollendEvent() {
      clearTimeout(window.scrollEndTimer);
      window.scrollEndTimer = setTimeout(this.handleScrollend, 100);
    },
    handleScroll() {
      const items = this.$refs.absoluteContainer.children;
      for (let i = 0; i < items.length; i++) {
        this.fadeItem(items[i]);
      }
      this.imitateScrollendEvent();
    },
    scrollLeft() {
      this.currentCardIndex--;
      if (this.currentCardIndex < 0) {
        this.currentCardIndex = 0;
      }
      this.currentScrollLeft -= CARD_WIDTH + CARD_GAP;
      if (this.isCurrentScrollLeftOutOfLowerLimit()) {
        this.setCurrentScrollLeftToLowerLimit();
      }
      this.$refs.absoluteContainer.scrollTo({
        left: this.currentScrollLeft,
        behavior: "smooth",
      });
    },
    scrollRight() {
      this.currentCardIndex++;
      if (this.currentCardIndex > this.lastIndex) {
        this.currentCardIndex = this.lastIndex;
      }
      this.currentScrollLeft += CARD_WIDTH + CARD_GAP;
      if (this.isCurrentScrollLeftOutOfGreaterLimit()) {
        this.setCurrentScrollLeftToGreaterLimit();
      }
      this.$refs.absoluteContainer.scrollTo({
        left: this.currentScrollLeft,
        behavior: "smooth",
      });
    },
    isCurrentScrollLeftOutOfGreaterLimit() {
      return this.currentScrollLeft > this.$refs.absoluteContainer.scrollWidth - this.$refs.absoluteContainer.clientWidth;
    },
    setCurrentScrollLeftToGreaterLimit() {
      this.currentScrollLeft = this.$refs.absoluteContainer.scrollWidth - this.$refs.absoluteContainer.clientWidth;
    },
    isCurrentScrollLeftOutOfLowerLimit() {
      return this.currentScrollLeft < 0;
    },
    setCurrentScrollLeftToLowerLimit() {
      this.currentScrollLeft = 0;
    },
    handleScrollend() {
      this.currentScrollLeft = this.$refs.absoluteContainer.scrollLeft;
      this.currentCardIndex = this.calculateCurrentCardIndexByCurrentScrollLeftAndCardWidth();
    },
    calculateCurrentCardIndexByCurrentScrollLeftAndCardWidth() {
      return Math.round(this.currentScrollLeft / (CARD_WIDTH + CARD_GAP));
    },
    scrollCards(event) {
      if (event.deltaY > 0) {
        this.currentScrollLeft += CARD_WIDTH / 3;
        if (this.isCurrentScrollLeftOutOfGreaterLimit()) {
          this.setCurrentScrollLeftToGreaterLimit();
        }
        this.$refs.absoluteContainer.scrollTo({
          left: this.currentScrollLeft,
          behavior: "smooth",
        });
      } else if (event.deltaY < 0) {
        this.currentScrollLeft -= CARD_WIDTH / 3;
        if (this.currentScrollLeft < 0) {
          this.currentScrollLeft = 0;
        }
        this.$refs.absoluteContainer.scrollTo({
          left: this.currentScrollLeft,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style>
* {
  --card-width: 348px;
  --card-shadow-width: 16px;
  --card-height: 358px;
  --card-slider-item-gap: 60px;
}

.card-slider {
  position: relative;
  min-width: var(--card-width);
  width: 100%;
  height: calc(var(--card-height) + 2 * var(--card-shadow-width));
}

.card-slider-absolute-positioned-container {
  position: absolute;
  width: calc(100% + var(--card-width) + var(--card-slider-item-gap));
  left: calc((-1) * (var(--card-width) + var(--card-slider-item-gap)));

  padding: var(--card-shadow-width) 0px;
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.card-slider-absolute-positioned-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.card-wrapper {
  scroll-snap-align: start;
  margin-right: var(--card-slider-item-gap);
}

.card-wrapper:nth-last-child(-n + 2) {
  margin-right: 0px;
}

.card-dummy-first {
  width: var(--card-width);
  flex-shrink: 0;
  visibility: hidden;
}

.card-dummy-last {
  flex-shrink: 0;
  visibility: hidden;
}

.card-slider-arrows {
  position: absolute;
  top: calc(100% + 30px - var(--card-shadow-width));

  display: flex;
  gap: 1.875rem;
}

.card-slider-arrows .arrow-holder {
  cursor: pointer;
  opacity: 1;
  transition: var(--default-transition);
}

.card-slider-arrows .arrow-holder:hover {
  opacity: 0.7;
  transition: var(--default-transition);
}

.arrow-inactive {
  filter: grayscale(0.7);
  pointer-events: none;
}
</style>
