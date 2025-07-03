<template>
  <button
    :disabled="disabled"
    class="reply-button"
    :class="{
      [theme[themeType]]: themeType,
      replied: isActive,
    }"
  >
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.601579 17.3332C0.583765 17.3333 0.565951 17.3319 0.548281 17.3291C0.396933 17.3058 0.276366 17.1882 0.247151 17.0352C-0.461138 13.3088 0.36501 9.86092 2.57027 7.32669C4.88868 4.66375 8.48167 3.26064 12.4744 3.44441L12.4745 0.367882C12.4744 0.219088 12.5625 0.0849398 12.6976 0.0279475C12.8327 -0.0289001 12.9882 0.00256833 13.0915 0.107854L19.8942 7.03039C20.0353 7.17411 20.0353 7.40689 19.8942 7.5506L13.0915 14.4731C12.9882 14.5784 12.8327 14.61 12.6976 14.5531C12.5625 14.4962 12.4744 14.3621 12.4745 14.2131V11.2528C7.49201 10.11 2.9108 13.3127 0.92063 17.138C0.858069 17.2581 0.735258 17.3332 0.601579 17.3332Z" fill="#1D2227" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ReplyButton",

  props: {
    themeType: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      isActive: false,

      theme: {
        light: "reply-button-light",
        dark: "reply-button-dark",
        "dark-with-accent-background": "reply-button-dark-with-accent-background",
      },
    };
  },
};
</script>

<style scoped>
.reply-button {
  padding: var(--padding-button-1);
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid;
  border-radius: var(--small-border-radius);
  cursor: pointer;
}

/* Light theme reply button */
.reply-button-light {
  border-color: var(--color-light);
}

.reply-button-light path {
  stroke: var(--color-light);
}

.reply-button-light:hover {
  border: 2px solid var(--color-accent-primary);
}

.reply-button-light:hover path {
  stroke: var(--color-accent-primary);
}

.reply-button-light:active {
  opacity: 50%;
}
.reply-button-light.replied {
  border: 2px solid var(--color-accent-primary);
  background: var(--gradient-card-dark);
}

.reply-button-light:active path,
.reply-button-light.replied path {
  fill: var(--color-dark);
  stroke: var(--color-dark);
}

/* dark theme reply button */
.reply-button-dark {
  border-color: var(--color-accent-primary);
}

.reply-button-dark svg path {
  fill: var(--color-accent-primary);
}

.reply-button-dark:hover {
  border: 2px solid var(--color-dark);
  fill: var(--color-accent-primary);
  stroke: var(--color-dark);
  background: var(--color-dark);
}

.reply-button-dark:hover path {
  stroke: var(--color-accent-primary);
  fill: var(--color-accent-primary);
}

.reply-button-dark:active {
  border: 2px solid var(--color-dark);
  fill: var(--color-accent-primary);
  background: var(--color-dark);
  opacity: 50%;
}

.reply-button-dark.replied {
  border: 2px solid var(--color-dark);
  fill: var(--color-accent-primary);
  background: var(--color-dark);
}

.reply-button-dark:active path,
.reply-button-dark.replied path {
  fill: var(--color-accent-primary);
  stroke: var(--color-gray-light);
}

/* reply-button-dark-with-accent-background */
.reply-button-dark-with-accent-background {
  border-color: var(--color-dark);
  background: var(--color-gray-light);
}

.reply-button-dark-with-accent-background path {
  stroke: var(--color-dark);
  fill: var(--color-dark);
}

.reply-button-dark-with-accent-background:hover {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  stroke: var(--color-dark);
  background: var(--color-dark);
}

.reply-button-dark-with-accent-background:hover path {
  stroke: var(--color-gray-light);
  fill: var(--color-gray-light);
}

.reply-button-dark-with-accent-background:active {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  background: var(--color-dark);
  opacity: 50%;
}

.reply-button-dark-with-accent-background.replied {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  background: var(--color-dark);
}

.reply-button-dark-with-accent-background:active path,
.reply-button-dark-with-accent-background.replied path {
  fill: var(--color-gray-light);
  stroke: var(--color-gray-light);
}
</style>
