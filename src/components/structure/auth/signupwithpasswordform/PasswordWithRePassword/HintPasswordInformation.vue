<template>
  <div v-if="isPasswordEmpty" class="hint-password-wrapper">
    <ul>
      <li
        :class="{
          'condition-is-met': isEnoughLength,
          'condition-is-not-met': !isEnoughLength,
        }"
      >
        At least 8 characters
      </li>
      <li
        :class="{
          'condition-is-met': isContainsCapitalLowercase,
          'condition-is-not-met': !isContainsCapitalLowercase,
        }"
      >
        Lowercase letters
      </li>
      <li
        :class="{
          'condition-is-met': isContainsCapitalLetter,
          'condition-is-not-met': !isContainsCapitalLetter,
        }"
      >
        Uppercase letters
      </li>
      <li
        :class="{
          'condition-is-met': isContainsDigitals,
          'condition-is-not-met': !isContainsDigitals,
        }"
      >
        Digit
      </li>
      <li
        :class="{
          'condition-is-met': isContainsSpecialChars,
          'condition-is-not-met': !isContainsSpecialChars,
        }"
      >
        Characters !@#$&*_>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isContainsDigitals: {
      type: Boolean,
      required: true,
    },
    isContainsCapitalLetter: {
      type: Boolean,
      required: true,
    },
    isContainsCapitalLowercase: {
      type: Boolean,
      required: true,
    },
    isContainsSpecialChars: {
      type: Boolean,
      required: true,
    },
    isEnoughLength: {
      type: Boolean,
      required: true,
    },
    isPasswordEmpty: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style>
.hint-password-wrapper {
  width: 170px;
  height: 95px;
  font-size: var(--small-font-size);
  font-weight: var(--regular-font-weight);
  background: var(--gradient-card-dark);
  padding: 11px 11px 11px 30px;
  border-radius: var(--small-border-radius);
}

.condition-is-not-met {
  color: var(--color-error);
}

.condition-is-met {
  color: var(--password-strength-strong);
}
</style>
