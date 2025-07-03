<template>
  <div class="sign-up-with-password-form-wrapper">
    <form class="sign-up-with-password-form">
      <div class="input-data">
        <div class="login-input-holder">
          <label class="name-title" for="publicNameField"> Public Name </label>
          <input
            id="publicNameField"
            v-model="publicNameField.value"
            type="text"
            class="input auth-input"
            :class="{
              errored: isPublicNameFieldEmpty && publicNameField.isAccessed,
            }"
            placeholder="Type your public name"
            @blur="publicNameField.isAccessed = true"
            @input="publicNameField.isAccessed = true"
          />
          <div v-show="publicNameField.isAccessed" class="input-errors-holder">
            <span v-for="(error, index) in publicNameFieldErrors" :key="index" class="error-message">
              {{ error.toString() }}
            </span>
          </div>
        </div>
        <div class="email-input-holder">
          <label class="name-title" for="email-field"> Email </label>
          <input
            id="email-field"
            v-model="emailField.value"
            type="email"
            class="input auth-input"
            :class="{
              errored: (isEmailFieldEmpty || !isEmail) && emailField.isAccessed,
            }"
            placeholder="Type email"
            @blur="(emailField.isAccessed = true), isEmailTaken()"
            @input="emailField.isAccessed = true"
          />
          <div v-show="emailField.isAccessed" class="input-errors-holder">
            <span v-for="(error, index) in emailFieldErrors" :key="index" class="error-message">
              {{ error.toString() }}
            </span>
          </div>
        </div>
        <PasswordWithRePassword :public-name-value="publicNameField.value" :email-value="emailField.value" @password-validated="passwordValidatedHandler" />
        <div class="auth-checkbox">
          <input id="terms" v-model="isTermsAccepted" type="checkbox" class="checkbox" />
          <label class="terms" for="terms"> I agree with </label>
          <span class="terms-link terms" @click="openTermsUseModal()"> Terms </span>
          <label class="terms" for="terms"> and </label>
          <span class="terms-link terms" @click="openPrivacyPolicyModal()"> Privacy Policy </span>
          <label class="terms" for="terms"> . </label>
        </div>
        <div class="signup-buttons">
          <button class="signup-main large" :disabled="!isValidForm" @click.prevent="signUpHandler()">Sign Up</button>
        </div>
      </div>
    </form>
    <div class="go-login-form">
      <span> Already have an account? </span>
      <router-link class="go-login-link" to="login"> Login </router-link>
    </div>
  </div>
</template>

<script>
import { signUp } from "aws-amplify/auth";
import router from "@/router";
import routerPaths from "@/data/router/path/routerPaths.json";

import { mapActions } from "vuex";
import applicationActions from "@/data/store/application/applicationActions.json";
import userActions from "@/data/store/user/userActions.json";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";

import TermsUse from "@/components/structure/modals/info/TermsUse.vue"; //TODO: move to modal plugin
import PrivacyPolicy from "@/components/structure/modals/info/PrivacyPolicy.vue"; //TODO: move to modal plugin

import PasswordWithRePassword from "./signupwithpasswordform/PasswordWithRePassword.vue";
import { DialogTemplateNames } from "@/data/modal/constants";
import { signUpValues } from "@/store/modules/application/applicationModule";

// eslint-disable-next-line
const emailCheckRegex = new RegExp(
  // eslint-disable-next-line
  "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"
);
const MAXIMUM_PUBLIC_NAME_LENGTH = 64;

export default {
  name: "SignUpWithPasswordForm",
  components: {
    PasswordWithRePassword,
  },
  data() {
    return {
      publicNameField: {
        value: "",
        isAccessed: false,
      },
      emailField: {
        value: "",
        isAccessed: false,
        isEmailTaken: false,
      },

      password: "",
      isPasswordValid: false,

      isTermsAccepted: false,
      isAuthFailed: false,
      authError: "",
      errorMessages: {
        ERROR_WEAK_PASSWORD: "The password is not strong enough",
        WARNING_MEDIUM_PASSWORD: "Ok to go",
        MESSAGE_STRONG_PASSWORD: "Strong password",
        EMPTY_USERNAME: "Please enter your public name",
        EMPTY_EMAIL: "Please enter your email",
        WRONG_EMAIL: "Please enter a valid email",
        EMAIL_TAKEN: "This email is already in use",
        // SAME_NAME_AND_PASSWORD: "Password cannot include your name or email",
        PUBLIC_NAME_LENGTH_OVER_MAXIMUM: "Please give a shorter name, up to " + MAXIMUM_PUBLIC_NAME_LENGTH + " characters",
      },
      MAXIMUM_PUBLIC_NAME_LENGTH: MAXIMUM_PUBLIC_NAME_LENGTH,
    };
  },
  computed: {
    modalTermsUseProps() {
      //TODO: use modal plugin instead
      return {
        displayedComponent: TermsUse,
      };
    },
    modalPrivacyPolicyProps() {
      return {
        displayedComponent: PrivacyPolicy,
      };
    },

    isPublicNameFieldEmpty() {
      return this.isStringEmpty(this.publicNameField.value);
    },
    /*
    isPublicNameFieldLengthLessThanMinimum() {
      return this.publicNameField.value.length < this.MINIMUM_PUBLIC_NAME_LENGTH;
    },
    */
    isPublicNameFieldLengthOverMaximum() {
      return this.publicNameField.value.length > this.MAXIMUM_PUBLIC_NAME_LENGTH;
    },
    publicNameFieldLength() {
      return this.publicNameField.value.length;
    },
    isEmailFieldEmpty() {
      return this.isStringEmpty(this.emailField.value);
    },
    isEmail() {
      return emailCheckRegex.test(this.emailField.value);
    },
    isValidForm() {
      return this.isPublicNameErrorsListEmpty && this.isEmailErrorsListEmpty && this.isPasswordValid && this.isTermsAccepted;
    },
    isPublicNameErrorsListEmpty() {
      return this.isArrayEmpty(this.publicNameFieldErrors);
    },
    isEmailErrorsListEmpty() {
      return this.isArrayEmpty(this.emailFieldErrors);
    },
    publicNameFieldErrors() {
      let publicNameFieldErrors = [];
      if (this.isPublicNameFieldEmpty) {
        publicNameFieldErrors.push([this.errorMessages.EMPTY_USERNAME]);
      }
      if (this.isPublicNameFieldLengthOverMaximum) {
        console.log("PUBLIC_NAME_LENGTH_OVER_MAXIMUM", publicNameFieldErrors);
        publicNameFieldErrors.push([this.errorMessages.PUBLIC_NAME_LENGTH_OVER_MAXIMUM]);
      }
      return publicNameFieldErrors;
    },

    emailFieldErrors() {
      let emailErrorsArray = [];
      if (this.isEmailFieldEmpty) {
        emailErrorsArray.push([this.errorMessages.EMPTY_EMAIL]);
      }
      if (!this.isEmailFieldEmpty && !this.isEmail) {
        emailErrorsArray.push([this.errorMessages.WRONG_EMAIL]);
      }
      if (this.emailField.isEmailTaken && this.isEmail) {
        emailErrorsArray.push([this.errorMessages.EMAIL_TAKEN]);
      }
      return emailErrorsArray;
    },
  },
  methods: {
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_FLAG]),
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    ...mapActions(storeModules.USER, [userActions.SET_CURRENT_USER, userActions.SET_USER, userActions.SET_IS_LOGGED_IN, userActions.SET_IS_NEED_FINAL_SIGN_UP]),
    passwordValidatedHandler({ isPasswordValid, password }) {
      this.isPasswordValid = isPasswordValid;
      this.password = password;
    },
    async signUpHandler() {
      await this.$load(async () => {
        await signUp({
          username: this.emailField.value,
          password: this.password,
          options: {
            userAttributes: {
              name: this.publicNameField.value,
            },
          },
        });
        this[applicationActions.SET_FLAG]({ flagName: "signUp", flagValue: signUpValues.AFTER_SIGNUP });
        console.log("redirecting...");
        router.push(routerPaths.LOGIN);
      });
    },
    isStringEmpty(string) {
      return string === "";
    },
    isArrayEmpty(array) {
      //seriously ???
      return array.length === 0;
    },
    isEmailTaken() {
      if (!this.isEmail) {
        this.emailField.isEmailTaken = false;
        return;
      }
    },
    openPrivacyPolicyModal() {
      this[modalActions.SET_MODAL](this.modalPrivacyPolicyProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    openTermsUseModal() {
      this[modalActions.SET_MODAL](this.modalTermsUseProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    finalSignUpStepsOnSignUpPage() {
      //TODO: remove
      this[userActions.SET_IS_NEED_FINAL_SIGN_UP](true);
    },
  },
};
</script>

<style scoped>
.sign-up-with-password-form-wrapper {
}
.sign-up-with-password-form {
  font-family: var(--main-font-family);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.input-data {
  width: 100%;
}
.signup {
  width: var(--width-auth-form);
  align-items: center;
  justify-content: center;
  margin: var(--margin-zero-auto);
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

/* counter public name length */
.login-input-holder {
  position: relative;
  margin-bottom: 18px;
}

.email-input-holder {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: var(--medium-font-size-2);
  font-weight: var(--regular-font-weight);
  letter-spacing: var(--app-letter-spacing);
}

.auth-input {
  padding-right: 100px;
  font-size: var(--medium-font-size);
  font-weight: var(--medium-font-weight);
  letter-spacing: var(--app-letter-spacing);
}

.auth-checkbox {
  color: var(--color-light);
  display: flex;
  justify-content: left;
  align-items: center;
}

.checkbox {
  margin-right: 10px;
  width: 22px;
  height: 22px;
}

.checkbox p {
  font-size: var(--small-font-size);
  font-weight: var(--large-font-weight);
}

.terms {
  letter-spacing: var(--app-letter-spacing);
  font-size: var(--regular-font-size) !important;
}

.auth-checkbox label {
  font-size: var(--small-font-size);
  font-weight: var(--small-font-weight);
  margin-bottom: 0px;
}

.auth-checkbox a {
  font-weight: var(--large-font-weight);
}

.terms-link {
  font-weight: var(--large-font-weight);
  text-decoration: none;
  color: var(--color-accent-primary);
  cursor: pointer;
  padding: 0 5px;
}

.terms-link:hover {
  text-decoration: underline;
}

.signup-main {
  font-size: var(--medium-font-size);
  letter-spacing: var(--app-letter-spacing);
  margin-top: 15px;
  box-shadow: 2px 2px 9px var(--transparent-accent-20);
  height: 45px !important;
  line-height: 45px !important;
}

.go-login-form {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-light);
  font-weight: var(--small-font-weight);
  letter-spacing: var(--app-letter-spacing);
}

.go-login-link {
  color: var(--color-gray-light);
  margin-left: 10px;
}

input::-ms-reveal,
input::-ms-clear {
  display: none;
}
</style>
