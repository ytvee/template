<template>
  <div class="custom-dropdown-select-place-holder">
    <div class="custom-dropdown-select" tabindex="-1" @blur="closeList()">
      <div class="select-container" :class="{ active: isListActive }" @click="toggleListActivation">
        <div ref="selectContainerItemActiveSubject" class="select-container-item-active-subject dummy">
          <div class="select-container-text-content">
            {{ currentItem.optionLabel }}
          </div>
          <div class="select-container-item-arrow">
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L12 11L22 2" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div class="dropdown-container" :class="{ active: isListActive }">
        <div v-if="isListNotEmpty" ref="dropdownContainerList" class="dropdown-container-list" :class="{ active: isListActive }">
          <div v-for="(item, index) of customSelectOptionsList" :key="index" class="select-container-item" :class="{ selected: isSelected(index) }" :data-id="index" @click="selectOption(index)">
            <div class="select-container-text-content">
              {{ item.optionLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedOption: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      classList: {
        DUMMY: "dummy",
      },
      customSelectOptionsList: [
        { optionValue: "solo", optionLabel: "Solo artist" },
        { optionValue: "band", optionLabel: "Band" },
      ],
      indexOfSelected: -1,
      // indexOfSelected: 0,
      isListActive: false,
      currentItem: {
        optionValue: "Choose artist type",
        optionLabel: "Choose artist type",
      },
      // currentItem: {"optionValue": "Solo artist"}
    };
  },
  computed: {
    isListNotEmpty() {
      return this.customSelectOptionsList.length;
    },
  },
  watch: {
    selectedOption(newSelectedOption) {
      if (newSelectedOption) {
        this.selectInitialOption(newSelectedOption);
      }
    },
    isListActive(newIsListActive) {
      this.toggleDropdownContainerListHeight(newIsListActive);
    },
    currentItem: {
      handler(newCurrentItem) {
        if (newCurrentItem) {
          this.$eventBus.emit("artist-type-edited", newCurrentItem.optionValue);
        }
      },
      deep: true,
    },
  },
  methods: {
    selectOption(index) {
      this.indexOfSelected = index;
      this.currentItem = this.customSelectOptionsList[index];
      this.$refs.selectContainerItemActiveSubject.classList.remove(this.classList.DUMMY);
      this.closeList();
    },
    selectInitialOption(newSelectedOption) {
      if (newSelectedOption) {
        const initialIndex = this.customSelectOptionsList.findIndex((item) => {
          return item.optionValue === newSelectedOption;
        });
        this.selectOption(initialIndex);
      }
    },
    isSelected(index) {
      return this.indexOfSelected === index;
    },
    toggleListActivation() {
      this.isListActive = !this.isListActive;
    },
    closeList() {
      this.isListActive = false;
    },
    toggleDropdownContainerListHeight(newIsListActive) {
      if (newIsListActive) {
        this.$refs.dropdownContainerList.style.height = this.$refs.dropdownContainerList.scrollHeight + "px";
      } else {
        this.$refs.dropdownContainerList.style.height = "0px";
      }
    },
  },
};
</script>

<style scoped>
.custom-dropdown-select-place-holder {
  position: relative;
  height: var(--input-height);
  width: 100%;
}

.custom-dropdown-select {
  position: absolute;
  width: 100%;
  min-height: var(--input-height);
  border: var(--thin-border-width) solid var(--color-gray);
  border-radius: var(--small-border-radius);
}

.select-container {
  position: absolute;
  z-index: 2;
  top: calc(var(--thin-border-width) * (-1));
  left: calc(var(--thin-border-width) * (-1));
  width: calc(100% + var(--thin-border-width) * 2);
  height: var(--input-height);
  border: var(--thin-border-width) solid var(--color-gray);
  padding: var(--input-padding);
  border-radius: var(--small-border-radius);
  cursor: pointer;
  user-select: none;

  display: flex;
  flex-direction: column;

  justify-content: center;
}

/*closed container*/
.select-container-item {
  display: flex;
  align-items: center;
  padding: var(--input-padding);
  padding-top: 0.40625rem;
  padding-bottom: 0.40625rem;

  cursor: pointer;
  user-select: none;

  font-size: var(--medium-font-size);
  font-weight: var(--medium-font-weight);
  color: var(--color-gray);
  transition: var(--default-transition);
}

.select-container-item:first-child {
  padding-top: 0.8125rem;
}

.select-container-item:last-child {
  padding-bottom: 0.8125rem;
}

.select-container-item.selected {
  transition: var(--default-transition);
  color: var(--color-accent-primary);
}

.select-container-item-active-subject {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: var(--default-transition);

  font-size: var(--medium-font-size);
  font-weight: var(--medium-font-weight);
  color: var(--color-gray);
}

.select-container-item-active-subject.dummy {
  color: var(--color-gray-medium);
}

.select-container-item:hover {
  transition: var(--default-transition);
}

.select-container-item-arrow svg path {
  stroke: var(--color-gray);
}

.select-container-text-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-container-item-arrow {
  display: flex;
  transition: var(--default-transition);
}

.select-container.active .select-container-item-arrow {
  transform: rotate(180deg);
  transition: var(--default-transition);
}

/*dropdown list*/
.dropdown-container {
  padding-top: calc(var(--input-height) - var(--thin-border-width) * 2);
  box-sizing: border-box;
  width: calc(100% - 2px);
  transition: background-color var(--default-transition);
}

.dropdown-container.active {
  background-color: var(--color-dark);
  transition: background-color var(--default-transition);
}

.dropdown-container-list {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  height: 0px;
  transition: height var(--default-transition);
}

.dropdown-container-list.active {
  transition: height var(--default-transition);
}
</style>
