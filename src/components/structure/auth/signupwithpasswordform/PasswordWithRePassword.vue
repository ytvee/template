<template>
  <div class="password-with-repassword">
    <div class="password-input-holder">
      <label class="password-title" :for="`${componentId}-password`"> Password </label>
      <input :id="`${componentId}-password`" v-model="password.value" :type="changingDisplayPassword" class="input auth-input" :class="{ errored: isPasswordEmpty && password.isAccessed }" placeholder="Type password" @blur="password.isAccessed = true" @input="password.isAccessed = true" />
      <div v-show="password.isAccessed" class="password-difficulty-holder">
        <IndicatorPassword :password-complexity="passwordDifficulty" :is-password-empty="!isPasswordEmpty" />
      </div>
      <div class="show-password">
        <PasswordDisplay :is-password-empty="isPasswordEmpty" @pass-current-state-password="overwriteCurrentStatePassword" />
      </div>
      <HintPasswordInformation class="password-difficulty-hint" :is-contains-digitals="isPasswordContainsDigitals" :is-contains-capital-letter="isPasswordContainsCapitalLetter" :is-contains-capital-lowercase="isPasswordContainsCapitalLowercase" :is-contains-special-chars="isPasswordContainsSpecialChars" :is-enough-length="isPasswordLengthMoreThanMin" :is-password-empty="!isPasswordEmpty" />
      <div v-show="password.isAccessed" class="input-errors-holder">
        <span v-for="(error, index) in passwordFieldErrors" :key="index" class="error-message">
          {{ error.toString() }}
        </span>
      </div>
    </div>
    <div class="repassword-input-holder">
      <label class="password-title" for="re-password"> Re-password </label>
      <input id="re-password" v-model="repassword.value" :type="changingDisplayRePassword" class="input password-input auth-input" :class="{ errored: isRePasswordEmpty && repassword.isAccessed }" placeholder="Retype password" @blur="repassword.isAccessed = true" @input="repassword.isAccessed = true" />
      <PasswordDisplay class="show-re-password" :is-password-empty="isRePasswordEmpty" @pass-current-state-re-password="overwriteCurrentStateRePassword" />
      <div v-show="repassword.isAccessed" class="input-errors-holder">
        <span v-for="(error, index) in rePasswordFieldErrors" :key="index" class="error-message">
          {{ error.toString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import IndicatorPassword from "./PasswordWithRePassword/IndicatorPassword.vue";
import PasswordDisplay from "./PasswordWithRePassword/PasswordDisplay.vue";
import HintPasswordInformation from "./PasswordWithRePassword/HintPasswordInformation.vue";
import { watchEffect } from "vue";

const containsCapitalLetterRegex = /^(.*[A-Z].*)$/;
const containsCapitalLowercaseRegex = /^(.*[a-z].*)$/;
const containsDigitalsRegex = /^(.*[0-9].*)$/;
const containsSpecialCharsRegex = /^(.*[!@#$&[*<>_].*)$/;

const PASSWORD_MIN_LENGTH = 8;

export default {
  name: "PasswordWithRePassword",
  components: {
    IndicatorPassword,
    PasswordDisplay,
    HintPasswordInformation,
  },
  props: {
    publicNameValue: {
      type: String,
      required: false, //INFO: not required when use to reset password
      default: "",
    },
    emailValue: {
      required: true,
      type: String,
    },
  },
  emits: ["password-validated"],
  data() {
    return {
      componentId: null,
      isActivePassword: false,
      isActiveRePassword: false,
      password: {
        value: "",
        isAccessed: false,
      },
      repassword: {
        value: "",
        isAccessed: false,
      },
      errorMessages: {
        EMPTY_PASSWORD: "Please enter your password",
        EMPTY_REPASSWORD: "Please re-enter your password",
        SAME_NAME_AND_PASSWORD: "Password cannot include your name or email",
        PASSWORDS_DO_NOT_MATCH: "Passwords don't match",
      },
      passwordDifficulties: {
        WEAK: 0,
        MEDIUM: 1,
        STRONG: 2,
      },
      PASSWORD_MIN_LENGTH,
    };
  },
  computed: {
    changingDisplayPassword() {
      return this.isActivePassword ? "text" : "password";
    },
    changingDisplayRePassword() {
      return this.isActiveRePassword ? "text" : "password";
    },
    isPasswordEmpty() {
      return this.isStringEmpty(this.password.value);
    },
    passwordDifficulty() {
      if (this.isPasswordStrong) {
        return this.passwordDifficulties.STRONG;
      } else if (this.isPasswordMedium) {
        return this.passwordDifficulties.MEDIUM;
      } else {
        return this.passwordDifficulties.WEAK;
      }
    },
    isPasswordStrong() {
      return this.isPasswordMedium && this.isPasswordContainsSpecialChars;
    },
    isPasswordMedium() {
      return this.isPasswordContainsCapitalLetter && this.isPasswordContainsDigitals && this.isPasswordLengthMoreThanMin && this.isPasswordContainsCapitalLowercase && !this.isPasswordEmpty;
    },
    isPasswordContainsDigitals() {
      return containsDigitalsRegex.test(this.password.value);
    },
    isPasswordContainsCapitalLetter() {
      return containsCapitalLetterRegex.test(this.password.value);
    },
    isPasswordContainsCapitalLowercase() {
      return containsCapitalLowercaseRegex.test(this.password.value);
    },
    isPasswordContainsSpecialChars() {
      return containsSpecialCharsRegex.test(this.password.value);
    },
    isPasswordLengthMoreThanMin() {
      return this.password.value.length >= PASSWORD_MIN_LENGTH;
    },
    passwordFieldErrors() {
      let passwordErrorsArray = [];
      if (this.isPasswordEmpty) {
        passwordErrorsArray.push([this.errorMessages.EMPTY_PASSWORD]);
      }
      return passwordErrorsArray;
    },
    isPasswordsEqual() {
      return this.password.value === this.repassword.value;
    },
    rePasswordFieldErrors() {
      let repasswordErrorsArray = [];
      if (this.isRePasswordEmpty) {
        repasswordErrorsArray.push([this.errorMessages.EMPTY_REPASSWORD]);
      } else if (!this.isPasswordsEqual) {
        repasswordErrorsArray.push([this.errorMessages.PASSWORDS_DO_NOT_MATCH]);
      } else if (this.isNameEmailAndPasswordSame) {
        repasswordErrorsArray.push([this.errorMessages.SAME_NAME_AND_PASSWORD]);
      }
      return repasswordErrorsArray;
    },
    isRePasswordEmpty() {
      return this.isStringEmpty(this.repassword.value);
    },
    isPasswordErrorsListEmpty() {
      return !this.passwordFieldErrors.length;
    },
    isRePasswordErrorsListEmpty() {
      return !this.rePasswordFieldErrors.length;
    },
    isNameEmailAndPasswordSame() {
      return (this.$props.publicNameValue.length && this.password.value.search(this.$props.publicNameValue) >= 0) || (this.$props.emailValue && this.password.value.search(this.$props.emailValue) >= 0);
    },
  },
  created() {
    this.componentId = this.$.uid;

    watchEffect(() => {
      let isPasswordValid = false;
      if (this.passwordDifficulty >= this.passwordDifficulties.MEDIUM && this.isPasswordErrorsListEmpty && this.isRePasswordErrorsListEmpty) {
        isPasswordValid = true;
      }
      this.$emit("password-validated", { isPasswordValid, password: this.password.value });
    });
  },

  methods: {
    isStringEmpty(string) {
      return string === "";
    },
    overwriteCurrentStatePassword(toggle) {
      this.isActivePassword = toggle;
    },
    overwriteCurrentStateRePassword(toggle) {
      this.isActiveRePassword = toggle;
    },
  },
};
</script>

<style scoped>
.password-input-holder {
  position: relative;
  margin-bottom: 18px;
}

.repassword-input-holder {
  position: relative;
  margin-bottom: 29px;
}
.auth-input {
  padding-right: 100px;
  font-size: var(--medium-font-size);
  font-weight: var(--medium-font-weight);
  letter-spacing: var(--app-letter-spacing);
}
.password-difficulty-holder {
  top: 62%;
  left: 73%;
  position: absolute;
}
.difficulty-password {
  display: flex;
}
.show-password {
  user-select: none;
}
.password-difficulty-hint {
  position: absolute;
  top: 27px;
  left: calc(var(--width-auth-form) + 15px);
}
.input-errors-holder {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  color: var(--color-error);
  font-size: var(--regular-font-size);
  font-weight: var(--medium-font-weight);
}
.error-message {
  position: absolute;
  display: block;
}
.show-re-password {
  position: absolute;
  left: 0px;
  top: 0px;
  user-select: none;
}
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
label {
  display: block;
  margin-bottom: 5px;
  font-size: var(--medium-font-size-2);
  font-weight: var(--regular-font-weight);
  letter-spacing: var(--app-letter-spacing);
}
</style>
