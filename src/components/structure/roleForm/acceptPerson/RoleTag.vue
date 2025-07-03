<template>
  <div>
    <div
      class="role-tag"
      :class="{
        activeRole: isActiveTag && isButton,
        inactiveRole: !isActiveTag && isButton,
        'role-button': isButton,
        notApprove: !isApprove && isButton,
      }"
      @click="confirmRole"
    >
      {{ tag }}
      <div v-if="isButton" class="toggle-role">
        <svg v-if="isActiveTag" class="toggle-role-minus" width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11.3C3.354 11.3 1.2 9.146 1.2 6.5C1.2 3.854 3.354 1.7 6 1.7C8.646 1.7 10.8 3.854 10.8 6.5C10.8 9.146 8.646 11.3 6 11.3ZM6 0.5C5.21207 0.5 4.43185 0.655195 3.7039 0.956723C2.97595 1.25825 2.31451 1.70021 1.75736 2.25736C0.632141 3.38258 0 4.9087 0 6.5C0 8.0913 0.632141 9.61742 1.75736 10.7426C2.31451 11.2998 2.97595 11.7417 3.7039 12.0433C4.43185 12.3448 5.21207 12.5 6 12.5C7.5913 12.5 9.11742 11.8679 10.2426 10.7426C11.3679 9.61742 12 8.0913 12 6.5C12 5.71207 11.8448 4.93185 11.5433 4.2039C11.2417 3.47595 10.7998 2.81451 10.2426 2.25736C9.68549 1.70021 9.02405 1.25825 8.2961 0.956723C7.56815 0.655195 6.78793 0.5 6 0.5ZM3 7.1H9V5.9H3" fill="#1D2227" />
        </svg>
        <svg v-else width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11.3C3.354 11.3 1.2 9.146 1.2 6.5C1.2 3.854 3.354 1.7 6 1.7C8.646 1.7 10.8 3.854 10.8 6.5C10.8 9.146 8.646 11.3 6 11.3ZM6 0.5C5.21207 0.5 4.43185 0.655195 3.7039 0.956723C2.97595 1.25825 2.31451 1.70021 1.75736 2.25736C0.632141 3.38258 0 4.9087 0 6.5C0 8.0913 0.632141 9.61742 1.75736 10.7426C2.31451 11.2998 2.97595 11.7417 3.7039 12.0433C4.43185 12.3448 5.21207 12.5 6 12.5C7.5913 12.5 9.11742 11.8679 10.2426 10.7426C11.3679 9.61742 12 8.0913 12 6.5C12 5.71207 11.8448 4.93185 11.5433 4.2039C11.2417 3.47595 10.7998 2.81451 10.2426 2.25736C9.68549 1.70021 9.02406 1.25825 8.2961 0.956723C7.56815 0.655195 6.78793 0.5 6 0.5ZM6.6 3.5H5.4V5.9H3V7.1H5.4V9.5H6.6V7.1H9V5.9H6.6V3.5Z" fill="#D9D9D9" />
        </svg>
      </div>
    </div>
    <div v-if="!isApprove" class="not-approved-plag">not approved</div>
  </div>
</template>

<script>
export default {
  name: "RoleTag",
  props: {
    tag: {
      type: String,
      required: true,
    },
    isButton: {
      type: Boolean,
      default: true,
    },
    notModerate: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApprove: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["is-tag-active"],
  data() {
    return {
      isActiveTag: this.isActive,
    };
  },
  methods: {
    confirmRole() {
      if (this.notModerate || !this.isButton) {
        return;
      }
      this.isActiveTag = !this.isActiveTag;
      this.$emit("is-tag-active", this.isActiveTag, this.tag);
    },
  },
};
</script>
<style scoped>
.role-tag {
  width: 100%;
  max-width: 160px;
  padding: 5px 10px;
  height: 30px;
  box-sizing: border-box;
  white-space: nowrap;
  border-radius: var(--small-border-radius);
  background: var(--color-gray-light);
  color: black;
  font-weight: var(--large-font-weight);
}
.role-button {
  border: 2px solid var(--color-dark);
  cursor: pointer;
  color: var(--color-dark);
  user-select: none;
  font-size: var(--small-font-size);
  letter-spacing: 1px;
}

.notApprove {
  position: relative;
  padding-right: 22px;
}

.activeRole {
  font-weight: var(--large-font-weight);
  background: var(--gradient-purple);
}

.toggle-role {
  position: absolute;
  right: 5px;
  top: 6px;
}
.activeRole:hover {
  color: var(--color-gray-medium);
  background: var(--gradient-purple);
}

.activeRole:hover .toggle-role-minus path {
  fill: var(--color-gray-medium);
}

.activeRole:active {
  font-weight: var(--large-font-weight);
  background: var(--gradient-purple);
}

.inactiveRole {
  color: var(--color-gray);
  font-weight: var(--large-font-weight);
  background: var(--color-gray-medium);
}

.inactiveRole:hover {
  color: var(--color-gray);
  background: var(--color-gray-medium);
}

.inactiveRole:active {
  font-weight: var(--large-font-weight);
}

.not-approved-plag {
  font-size: 8px;
  font-weight: 300;
  line-height: 9.75px;
  text-align: center;
  color: var(--color-gray);
  letter-spacing: 1px;
}
</style>
