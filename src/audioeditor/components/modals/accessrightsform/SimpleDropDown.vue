<template>
  <div class="access-rights-user-rights">
    <div class="access-rights-user-rights-wrapper" @click="openMenu">
      <span>{{ isProjectOwner ? "owner" : selectedOption }}</span>
      <div v-if="!isProjectOwner" class="arrow-div">
        <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.38555 3.64935L0.891297 1.23268C0.856893 1.19935 0.831205 1.16335 0.814233 1.12468C0.79726 1.08602 0.788545 1.04424 0.788086 0.999349C0.788086 0.91046 0.819737 0.832682 0.88304 0.766015C0.946342 0.699349 1.02937 0.666016 1.13212 0.666016H6.36146C6.46467 0.666016 6.54793 0.699349 6.61123 0.766015C6.67453 0.832682 6.70595 0.91046 6.7055 0.999349C6.7055 1.02157 6.67109 1.09935 6.60228 1.23268L4.10803 3.64935C4.05069 3.7049 3.99335 3.74379 3.93601 3.76602C3.87867 3.78824 3.8156 3.79935 3.74679 3.79935C3.67798 3.79935 3.61491 3.78824 3.55757 3.76602C3.50023 3.74379 3.44289 3.7049 3.38555 3.64935Z" fill="currentColor" />
        </svg>
      </div>
      <div v-if="isMenuOpened && !isProjectOwner" class="access-rights-dropdown">
        <div v-for="option in options" :key="option.id" class="access-rights-dropdown-option" @click="setOption(option.id)">
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleDropDown",
  props: {
    parentId: {
      type: Number,
      required: false,
    },
    isProjectOwner: {
      type: Boolean,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  emits: ["set-option-for-user"],
  data() {
    return {
      selectedOption: this.options[0].label,
      isMenuOpened: false,
    };
  },
  methods: {
    openMenu() {
      this.isMenuOpened = !this.isMenuOpened;
    },
    setOption(id) {
      this.selectedOption = this.options[id].label;
      if (!this.parentId) {
        this.$emit("set-option-for-user", { optionId: id });
        return;
      }
      this.$emit("set-option-for-user", { parentId: this.parentId, optionId: id });
    },
  },
};
</script>

<style scoped>
.access-rights-user-rights {
  width: 100px;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  user-select: none;
}

.access-rights-user-rights-wrapper {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--smallest-block-gap);
  cursor: pointer;
}

.arrow-div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.access-rights-dropdown {
  position: absolute;
  top: 10px;
  left: -10px;
  width: 80px;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  gap: var(--smallest-block-gap);
  background-color: var(--transparent-light-17);
  backdrop-filter: blur(4px);
  white-space: nowrap;
  border-radius: 4px;
  z-index: 100;
}

.access-rights-dropdown-option {
  border-radius: 4px;
  padding: 5px;
}

.access-rights-dropdown-option:hover {
  background-color: var(--transparent-light-38);
}
</style>
