<template>
  <div class="forum-paginator">
    <div class="svg-button-stroke pagination-button" :class="{ disabled: isFirstPage }" @click="firstPageClickHandler">
      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 2L12 12L21 22" stroke="#D9D9D9" stroke-width="3" stroke-linecap="round" />
        <path d="M12 2L3 12L12 22" stroke="#D9D9D9" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>
    <div class="svg-button-stroke pagination-button" :class="{ disabled: isFirstPage }" @click="previousPageClickHandler">
      <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 12L12 22" stroke="#D9D9D9" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>

    <div
      v-for="pageNumber in displayedPageNumbers"
      :key="pageNumber"
      class="page-number-holder"
      :class="{
        'current-page-number': pageNumber === $props.currentPageNumber,
      }"
      @click="pageNumberClickHandler(pageNumber)"
    >
      {{ pageNumber }}
    </div>

    <div class="svg-button-stroke pagination-button" :class="{ disabled: isLastPage }" @click="nextPageClickHandler">
      <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L11 12L2 22" stroke="#D9D9D9" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>
    <div class="svg-button-stroke pagination-button" :class="{ disabled: isLastPage }" @click="lastPageClickHandler">
      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 22L11 12L2 2" stroke="#D9D9D9" stroke-width="3" stroke-linecap="round" />
        <path d="M11 22L20 12L11 2" stroke="#D9D9D9" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>

<script>
const MAX_DISPLAYED_PAGE_NUMBERS = 5;
export default {
  name: "ForumPaginator",
  props: {
    pagesCount: {
      type: Number,
      required: true,
    },
    currentPageNumber: {
      type: Number,
      required: true,
    },
  },
  emits: ["page-number-clicked"],
  data() {
    return {
      firstPage: 1,
      displayedPageNumbers: [],
    };
  },
  computed: {
    isFirstPage() {
      return this.$props.currentPageNumber === 1;
    },
    isLastPage() {
      return this.$props.currentPageNumber === this.$props.pagesCount;
    },
  },
  watch: {
    pagesCount: {
      handler(newPagesCount) {
        this.updateDisplayedPageNumbers(newPagesCount, this.$props.currentPageNumber);
      },
      immediate: true,
    },
    currentPageNumber: {
      handler(newCurrentPageNumber) {
        this.updateDisplayedPageNumbers(this.$props.pagesCount, newCurrentPageNumber);
      },
    },
  },
  methods: {
    updateDisplayedPageNumbers(newPagesCount, newCurrentPageNumber) {
      const isOdd = MAX_DISPLAYED_PAGE_NUMBERS % 2;
      const leftPageNumbersCount = isOdd ? Math.floor(MAX_DISPLAYED_PAGE_NUMBERS / 2) : Math.floor(MAX_DISPLAYED_PAGE_NUMBERS / 2) - 1;
      const rightPageNumbersCount = Math.floor(MAX_DISPLAYED_PAGE_NUMBERS / 2);
      let leftDisplayedPageNumbersCount = newCurrentPageNumber - 1 >= leftPageNumbersCount ? leftPageNumbersCount : newCurrentPageNumber - 1;
      const rightExtraPagesCount = leftPageNumbersCount - leftDisplayedPageNumbersCount;
      const rightPageNumbersCountWithExtras = rightPageNumbersCount + rightExtraPagesCount;
      const rightDisplayedPageNumbersCount = newCurrentPageNumber + rightPageNumbersCountWithExtras <= newPagesCount ? rightPageNumbersCountWithExtras : newPagesCount - newCurrentPageNumber;
      const leftExtraPagesCount = rightPageNumbersCountWithExtras - rightDisplayedPageNumbersCount;
      leftDisplayedPageNumbersCount = newCurrentPageNumber - 1 - leftDisplayedPageNumbersCount >= leftExtraPagesCount ? leftDisplayedPageNumbersCount + leftExtraPagesCount : newCurrentPageNumber - 1;
      const displayedPageNumbers = [this.$props.currentPageNumber];

      for (let i = 0; i < leftDisplayedPageNumbersCount; i++) {
        displayedPageNumbers.unshift(this.$props.currentPageNumber - (i + 1));
      }
      for (let i = 0; i < rightDisplayedPageNumbersCount; i++) {
        displayedPageNumbers.push(this.$props.currentPageNumber + (i + 1));
      }
      this.displayedPageNumbers = [...displayedPageNumbers];
    },
    pageNumberClickHandler(pageNumber) {
      this.$emit("page-number-clicked", pageNumber);
    },
    firstPageClickHandler() {
      this.pageNumberClickHandler(1);
    },
    previousPageClickHandler() {
      if (this.currentPageNumber - 1 >= 1) {
        this.pageNumberClickHandler(this.currentPageNumber - 1);
      }
    },
    nextPageClickHandler() {
      if (this.currentPageNumber + 1 <= this.$props.pagesCount) {
        this.pageNumberClickHandler(this.currentPageNumber + 1);
      }
    },
    lastPageClickHandler() {
      this.pageNumberClickHandler(this.$props.pagesCount);
    },
    isCurrentPageNumber(pageNumber) {
      return pageNumber === this.$props.currentPageNumber;
    },
  },
};
</script>
<style scoped>
* {
  --page-numbers-width: 12px;
  --gap-between-page-numbers: 25px;
  --gap-between-page-numbers-containers: 5px;
}
.forum-paginator {
  height: 34px;
  border-radius: var(--button-border-radius);
  background: var(--color-dark);
  box-shadow: 0px 4px 4px 0px var(--transparent-accent-10);
  padding: 5px 14px;
  display: flex;
  align-items: center;
  gap: var(--gap-between-page-numbers-containers);
}
.pagination-button:nth-child(1) {
  margin-right: calc(var(--gap-between-page-numbers) - var(--gap-between-page-numbers-containers));
}
.pagination-button:nth-child(2) {
  margin-right: calc((var(--gap-between-page-numbers) - var(--gap-between-page-numbers-containers)) / 2);
}
.pagination-button:nth-last-child(1) {
  margin-left: calc(var(--gap-between-page-numbers) - var(--gap-between-page-numbers-containers));
}
.pagination-button:nth-last-child(2) {
  margin-left: calc((var(--gap-between-page-numbers) - var(--gap-between-page-numbers-containers)) / 2);
}
.page-number-holder {
  min-width: calc(var(--page-numbers-width) + var(--gap-between-page-numbers) - var(--gap-between-page-numbers-containers));
  text-align: center;
  font-size: var(--button-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-gray-medium);
  user-select: none;
  cursor: pointer;
}
.page-number-holder.current-page-number {
  color: var(--color-gray-light);
}
</style>
