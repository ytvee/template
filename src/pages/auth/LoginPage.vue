<template>
  <div class="login-page">
    <div class="login-page-content">
      <h2>Login</h2>
      <div class="social-auth-providers-holder">
        <SignInWithCognito />
        <h3 class="login-page-divider">or</h3>
        <SignInWithPasswordForm />
      </div>
      <div class="use-terms-private-policy">
        <p>
          By logging in you indicate that you have read and agree to your
          <span class="terms-link" @click="openModalTermsUse()"> Terms of Use </span>
          and
          <span class="terms-link" @click="openModalPrivacyPolicy()"> Privacy Policy </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import userGetters from "@/data/store/user/userGetters.json";
import modalActions from "@/data/store/modal/modalActions.json";
import TermsUse from "@/components/structure/modals/info/TermsUse.vue";
import PrivacyPolicy from "@/components/structure/modals/info/PrivacyPolicy.vue";
import SignInWithCognito from "@/components/structure/cognito/SignInWithCognito.vue";
import SignInWithPasswordForm from "@/components/structure/auth/SignInWithPasswordForm.vue";
import { DialogTemplateNames } from "@/data/modal/constants";
import { cognitoMessages } from "@/data/cognito/constants";

export default {
  name: "LoginPage",
  components: {
    SignInWithCognito,
    SignInWithPasswordForm,
  },
  created() {
    if (this.flags.signUp) {
      this.$modal.openModalWithName(DialogTemplateNames.INFORMATION_MESSAGE, { message: cognitoMessages.INFO.SIGN_UP_CONFIRMATION_LINK_WAS_SENT_TO_EMAIL });
      this[applicationActions.SET_FLAG]({ flagName: "signUp", flagValue: null });
    }
  },
  computed: {
    ...mapState(storeModules.APPLICATION, {
      flags: (state) => state.flags,
    }),
    ...mapGetters(storeModules.USER, [userGetters.HAS_ROLE]),
    modalTermsUseProps() {
      return {
        displayedComponent: TermsUse,
      };
    },
    modalPrivacyPolicyProps() {
      return {
        displayedComponent: PrivacyPolicy,
      };
    },
  },
  methods: {
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_FLAG]),
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    openModalPrivacyPolicy() {
      this.$modal.openModalWithName(DialogTemplateNames.PRIVACY_POLICY);
    },
    openModalTermsUse() {
      this.$modal.openModalWithName(DialogTemplateNames.TERMS_USE);
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.login-page-content {
  width: 365px;
  align-items: center;
  justify-content: center;
}
.login-page-divider {
  text-align: center;
}
h2 {
  text-align: center;
  letter-spacing: var(--app-letter-spacing);
  margin-bottom: 15px;
}
.social-auth-providers-holder {
  margin-bottom: 15px;
}
.social-auth-providers-holder > *:not(:last-child) {
  margin-bottom: 15px;
}

.use-terms-private-policy {
  color: var(--color-light);
  font-size: var(--small-font-size);
  font-weight: var(--small-font-weight);
  letter-spacing: var(--app-letter-spacing);
  text-align: center;
  margin-bottom: 15px;
}

.terms-link {
  font-weight: var(--large-font-weight);
  text-decoration: none;
  color: var(--color-accent-primary);
  cursor: pointer;
}

.terms-link:hover {
  text-decoration: underline;
}
</style>
