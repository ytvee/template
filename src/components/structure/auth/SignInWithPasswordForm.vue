<template>
  <div class="sign-in-with-password-form-wrapper">
    <form class="login">
      <div class="input-data">
        <div class="login-input-holder">
          <label class="email-title" for="email"> Email </label>
          <input id="email" v-model="email.value" type="text" class="input login-input" :class="{ errored: email.isAccessed && emailErrors.length }" placeholder="Type email" @blur="email.isAccessed = true" @input="email.isAccessed = true" />
          <div v-show="email.isAccessed && emailErrors.length" class="input-errors-holder">
            <span v-for="(error, index) in emailErrors" :key="index" class="error-message">
              {{ error.toString() }}
            </span>
          </div>
        </div>
        <div class="password-input-holder">
          <label class="password-title" for="password">Password</label>
          <input id="password" v-model="password.value" type="password" class="input password-input" :class="{ errored: password.isAccessed && passwordErrors.length }" placeholder="Type password" @blur="password.isAccessed = true" @input="password.isAccessed = true" />
          <div v-show="password.isAccessed && passwordErrors.length" class="input-errors-holder">
            <span v-for="(error, index) in passwordErrors" :key="index" class="error-message">
              {{ error.toString() }}
            </span>
          </div>
        </div>
      </div>
      <div class="forgot-password hide">
        <a href="#"> Forgot password? </a>
      </div>
      <div class="main-login-btn-holder">
        <button class="login-main-btn large" :disabled="!isFormContentValid" @click.prevent="login()">Login</button>
        <div v-show="isAuthFailed && !emailErrors.length && !passwordErrors.length" class="input-errors-holder">
          <span class="error-message">
            {{ authError }}
          </span>
        </div>
      </div>
      <div class="signin-management-entry">
        <div class="signin-management-entry-left-column">
          <p>No account?</p>
        </div>
        <div class="signin-management-entry-right-column">
          <p class="signup-label" @click="$router.push({ path: '/signup' })">Sign up</p>
          <div class="signup-svg">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.53033 6.53033C9.82322 6.23744 9.82322 5.76256 9.53033 5.46967L4.75736 0.696699C4.46447 0.403806 3.98959 0.403806 3.6967 0.696699C3.40381 0.989593 3.40381 1.46447 3.6967 1.75736L7.93934 6L3.6967 10.2426C3.40381 10.5355 3.40381 11.0104 3.6967 11.3033C3.98959 11.5962 4.46447 11.5962 4.75736 11.3033L9.53033 6.53033ZM0 6.75H9V5.25H0V6.75Z" fill="#231FCF" />
              <path d="M9.53033 6.53033C9.82322 6.23744 9.82322 5.76256 9.53033 5.46967L4.75736 0.696699C4.46447 0.403806 3.98959 0.403806 3.6967 0.696699C3.40381 0.989593 3.40381 1.46447 3.6967 1.75736L7.93934 6L3.6967 10.2426C3.40381 10.5355 3.40381 11.0104 3.6967 11.3033C3.98959 11.5962 4.46447 11.5962 4.75736 11.3033L9.53033 6.53033ZM0 6.75H9V5.25H0V6.75Z" fill="url(#paint0_linear_829_3585)" />
              <defs>
                <linearGradient id="paint0_linear_829_3585" x1="-0.835714" y1="5.96667" x2="2.50493" y2="11.1378" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div class="signin-management-entry">
        <div class="signin-management-entry-left-column">
          <p>Didn't receive the link by email?</p>
        </div>
        <div class="signin-management-entry-right-column" @click="resendSignUpCodeHandler">Resend confirmation link</div>
      </div>
      <div class="signin-management-entry">
        <div class="signin-management-entry-left-column">Forgot password?</div>
        <div class="signin-management-entry-right-column" @click="resetPasswordHandler">Reset password with email</div>
      </div>
    </form>
  </div>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import userActions from "@/data/store/user/userActions.json";
import userGetters from "@/data/store/user/userGetters.json";

import { completeInflightFlowAndGetTokensFromAmplify } from "@/utils/cognito/cognitoUtils";

import { signIn, resendSignUpCode, resetPassword } from "aws-amplify/auth";
import { saveCognitoTokensInLocalStorage } from "@/utils/cognito/cognitoUtils";
import { DialogTemplateNames } from "@/data/modal/constants";
import { cognitoMessages } from "@/data/cognito/constants";

// eslint-disable-next-line
const emailCheckRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const errors = {
  INVALID_USER: "Invalid user",
  INVALID_PASSWORD: "Invalid password",

  INVALID_EMAIL: "Email is invalid",
};

export default {
  name: "SignInWithPasswordForm",
  data() {
    return {
      email: {
        value: "",
        isAccessed: false,
      },
      password: {
        value: "",
        isAccessed: false,
      },
      isAuthFailed: false,
      authError: "",
      errorMessages: {
        EMPTY_EMAIL: "Please enter your email",
        EMAIL_NOT_MATCH_MASK: "Should match example@example.example",
        EMPTY_PASSWORD: "Please enter your password",
        INVALID_AUTH: "Invalid email or password",
      },
    };
  },
  computed: {
    ...mapGetters(storeModules.USER, [userGetters.HAS_ROLE]),
    isEmailEmpty() {
      return this.isStringEmpty(this.email.value);
    },
    isPasswordEmpty() {
      return this.isStringEmpty(this.password.value);
    },
    isEmailMatchingEmailMask() {
      return emailCheckRegex.test(this.email.value);
    },

    emailErrors() {
      let emailErrorsArray = [];
      if (this.isEmailEmpty) {
        emailErrorsArray.push([this.errorMessages.EMPTY_EMAIL]);
      }
      if (!this.isEmailEmpty && !this.isEmailMatchingEmailMask) {
        emailErrorsArray.push(this.errorMessages.EMAIL_NOT_MATCH_MASK);
      }
      return emailErrorsArray;
    },
    passwordErrors() {
      let passwordErrorsArray = [];
      if (this.isPasswordEmpty) {
        passwordErrorsArray.push([this.errorMessages.EMPTY_PASSWORD]);
      }

      return passwordErrorsArray;
    },
    isFormContentValid() {
      return !this.emailErrors.length && !this.passwordErrors.length;
    },
  },
  methods: {
    ...mapActions(["afterAuthentication"]),
    ...mapActions(storeModules.USER, [userActions.SET_USER, userActions.SET_IS_LOGGED_IN, userActions.SET_CURRENT_USER]),
    ...mapActions("wallet", ["loadWalletsFromBackend"]),
    isStringEmpty(string) {
      return string === "";
    },
    openPasswordResetModal() {
      this.$modal.openModalWithName(DialogTemplateNames.RESET_PASSWORD, { email: this.email.value }, { isNonClosableByClickOnPeriphery: true });
    },
    async login() {
      await this.$load(async () => {
        const signInResult = await signIn({
          username: this.email.value,
          password: this.password.value,
        });
        switch (signInResult.nextStep.signInStep) {
          case "CONFIRM_SIGN_UP": {
            console.log(cognitoMessages.INFO.CONFIRM_YOUR_ACCOUNT_USING_THE_LINK);
            this.$modal.openModalWithName(DialogTemplateNames.INFORMATION_MESSAGE, { message: cognitoMessages.INFO.CONFIRM_YOUR_ACCOUNT_USING_THE_LINK });
            break;
          }
          case "DONE": {
            const tokensFromAmplify = await completeInflightFlowAndGetTokensFromAmplify();
            saveCognitoTokensInLocalStorage(tokensFromAmplify.accessToken, tokensFromAmplify.idToken, tokensFromAmplify.refreshToken);
            await this.afterAuthentication({ idToken: tokensFromAmplify.idToken });
            console.log("redirecting...");
            router.push("/artists");
            break;
          }
        }
      });
    },
    async resendSignUpCodeHandler() {
      await this.$load(async () => {
        if (!this.email.value) {
          this.$modal.openModalWithName(DialogTemplateNames.INFORMATION_MESSAGE, { message: cognitoMessages.INFO.RESEND_SIGN_UP_CODE_EMAIL_EMPTY });
        } else {
          await resendSignUpCode({
            username: this.email.value,
          });
          this.$modal.openModalWithName(DialogTemplateNames.INFORMATION_MESSAGE, { message: cognitoMessages.INFO.RESEND_SIGN_UP_CODE_SUCCESS });
        }
      });
    },
    handleResetPasswordNextSteps(output) {
      const { nextStep } = output;
      switch (nextStep.resetPasswordStep) {
        case "CONFIRM_RESET_PASSWORD_WITH_CODE": {
          const codeDeliveryDetails = nextStep.codeDeliveryDetails;
          console.log(cognitoMessages.INFO.RESET_PASSWORD_CODE_SEND_SUCCESS(codeDeliveryDetails.deliveryMedium.toLowerCase()));
          // Collect the confirmation code from the user and pass to confirmResetPassword.
          this.openPasswordResetModal();
          break;
        }
        case "DONE":
          console.log("Successfully reset password.");
          break;
      }
    },
    async resetPasswordHandler() {
      await this.$load(async () => {
        if (!this.email.value) {
          this.$modal.openModalWithName(DialogTemplateNames.INFORMATION_MESSAGE, { message: cognitoMessages.INFO.RESET_PASSWORD_EMAIL_EMPTY });
        } else {
          const output = await resetPassword({
            username: this.email.value,
          });
          this.handleResetPasswordNextSteps(output);
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  width: 365px;
  align-items: center;
  justify-content: center;
}

.input-data h2 {
  letter-spacing: var(--app-letter-spacing);
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

.email-title {
  font-size: var(--medium-font-size-2);
  font-weight: var(--regular-font-weight);
  letter-spacing: var(--app-letter-spacing);
  line-height: 22px;
}

.login-input-holder {
  margin-bottom: 18px;
}

.login-input {
  padding-left: var(--regular-padding);
  font-size: var(--regular-font-size);
  font-weight: var(--medium-font-weight);
  letter-spacing: var(--app-letter-spacing);
}

.password-input-holder {
  letter-spacing: var(--app-letter-spacing);
  line-height: 22px;
  margin-bottom: 18px;
}

.password-title {
  font-size: var(--medium-font-size-2);
  font-weight: var(--regular-font-weight);
  letter-spacing: var(--app-letter-spacing);
}

.password-input {
  padding-left: var(--regular-padding);
  font-size: var(--medium-font-size);
  font-weight: var(--medium-font-weight);
}

.main-login-btn-holder {
  margin-bottom: 25px;
}

.input-errors-holder {
  position: relative;
}

.error-message {
  position: absolute;
  display: block;
  color: var(--color-error);
  font-size: var(--regular-font-size);
  font-weight: var(--medium-font-weight);
  letter-spacing: var(--app-letter-spacing);
}

.forgot-password {
  text-align: right;
  font-weight: var(--large-font-weight);
  font-size: var(--small-font-size);
  letter-spacing: var(--app-letter-spacing);
  cursor: pointer;
  padding-right: var(--regular-padding);
}

.forgot-password a {
  text-decoration: none;
  color: var(--color-light);
}

.forgot-password a:hover {
  color: var(--color-accent-primary);
}

.login-main-btn {
  height: 45px !important;
  line-height: 45px !important;
  margin-top: 15px;
  margin-bottom: 5px;
  box-shadow: 2px 2px 9px var(--transparent-accent-20);
  letter-spacing: var(--app-letter-spacing);
}

.signin-management-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.signin-management-entry-left-column {
  font-size: var(--small-font-size);
  font-weight: var(--small-font-weight);
  color: var(--color-light);
  letter-spacing: var(--app-letter-spacing);
}
.signin-management-entry-right-column {
  display: flex;
  align-items: center;
  text-align: end;

  cursor: pointer;
  color: var(--color-gray-light);
  letter-spacing: var(--app-letter-spacing);

  font-size: var(--small-font-size);
  font-weight: var(--small-font-weight);

  margin-right: 5px;
}
.signin-management-entry-right-column svg {
  margin-left: 5px;
}
.signup-svg {
  display: flex;
  align-items: center;
}
</style>
