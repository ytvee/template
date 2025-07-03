<template>
  <div v-if="passwordComplexity === 0 && isPasswordEmpty" class="difficulty-password" title="Password strength">
    <div class="password-difficulty-item red-indicator" />
    <div class="password-difficulty-item gray-indicator" />
    <div class="password-difficulty-item gray-indicator" />
    <span class="error-weak-password">
      {{ errorMessages.ERROR_WEAK_PASSWORD }}
    </span>
  </div>
  <div v-else-if="passwordComplexity === 1" class="difficulty-password" title="Password strength">
    <div class="password-difficulty-item yellow-indicator" />
    <div class="password-difficulty-item yellow-indicator" />
    <div class="password-difficulty-item gray-indicator" />
    <span class="warning-medium-password">
      {{ errorMessages.WARNING_MEDIUM_PASSWORD }}
    </span>
  </div>
  <div v-else-if="passwordComplexity === 2" class="difficulty-password" title="Password strength">
    <div class="password-difficulty-item green-indicator" />
    <div class="password-difficulty-item green-indicator" />
    <div class="password-difficulty-item green-indicator" />
    <span class="message-strong-password">
      {{ errorMessages.MESSAGE_STRONG_PASSWORD }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    passwordComplexity: {
      type: Number,
      required: true,
    },
    isPasswordEmpty: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      errorMessages: {
        ERROR_WEAK_PASSWORD: "The password is not strong enough",
        WARNING_MEDIUM_PASSWORD: "Ok to go",
        MESSAGE_STRONG_PASSWORD: "Strong password",
      },
    };
  },
};
</script>

<style>
.password-difficulty-item {
  width: 10px;
  height: 10px;
  border: 2px;
  border-radius: var(--border-raduis-circle);
  margin-right: 7px;
}

.gray-indicator {
  background: var(--password-strength-inactive);
}

.red-indicator {
  background: var(--password-strength-weak);
}

.yellow-indicator {
  background: var(--password-strength-medium);
}

.green-indicator {
  background: var(--password-strength-strong);
}
.error-weak-password,
.warning-medium-password,
.message-strong-password {
  position: absolute;
  left: -264px;
  right: 0;
  bottom: -24px;
  top: 27px;
  font-size: 13px;
}

.error-weak-password {
  color: var(--color-error);
}
.warning-medium-password {
  color: var(--password-strength-medium);
}

.message-strong-password {
  color: var(--password-strength-strong);
}
</style>
