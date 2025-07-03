<template>
  <div class="oidc-twitter-callback-page"></div>
</template>

<script>
import { checkAuthorizeState } from "@/utils/cognito/cognitoUtils";
import { getLocalStorageSubEntry, removeLocalStorageSubEntry, LocalStorageEntryName, JGTwitterOIDCLocalStorageSubEntryName } from "@/utils/browserStorages/browserStoragesUtils";
export default {
  name: "OIDCTwitterCallbackPage",
  async created() {
    await this.$load(async () => {
      await this.processTwitterResponseAndRedirectToCognitoCallbackUrl();
    });
  },
  methods: {
    getParamsFromTwitter() {
      const JGTwitterOIDCTwitterStateFromTwitter = Buffer.from(this.$route.query.state, "base64").toString();
      const codeFromTwitter = this.$route.query.code;
      return { JGTwitterOIDCTwitterStateFromTwitter, codeFromTwitter };
    },
    processJGTwitterOIDCTwitterState(JGTwitterOIDCTwitterStateFromTwitter) {
      const JGTwitterOIDCTwitterStateFromLocalStorage = getLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.JGTwitterOIDCTwitterState);
      checkAuthorizeState(JGTwitterOIDCTwitterStateFromTwitter, JGTwitterOIDCTwitterStateFromLocalStorage, "twitter");
      removeLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.JGTwitterOIDCTwitterState); //the state has been checked and is no longer needed
    },
    processTwitterResponse() {
      const { JGTwitterOIDCTwitterStateFromTwitter, codeFromTwitter } = this.getParamsFromTwitter();
      this.processJGTwitterOIDCTwitterState(JGTwitterOIDCTwitterStateFromTwitter);

      const JGTwitterOIDCTwitterCodeVerifier = removeLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.JGTwitterOIDCTwitterCodeVerifier);

      return {
        codeFromTwitter,
        JGTwitterOIDCTwitterCodeVerifier,
      };
    },
    async getCodeFromJGTwitterOIDCBackend(codeFromTwitter, JGTwitterOIDCTwitterCodeVerifier) {
      const payload = {
        provider: "twitter",
        code: codeFromTwitter,
        code_verifier: JGTwitterOIDCTwitterCodeVerifier,
      };
      const response = await this.$api.jgoidc.getJGTwitterOIDCCode(payload);
      const JGTwitterOIDCCode = response.data.data.code;
      return JGTwitterOIDCCode;
    },
    /**
     * The purpose of the function is to restore the scope string. In this case, to the scope string returned along with the code from the external identity provider (such as Twitter), those scopes that were deleted when contacting the identity provider are added back to scope string.
     */
    recoverScopeString(scopeFromExternalOIDC, removedScopeFieldsString) {
      return scopeFromExternalOIDC + " " + removedScopeFieldsString;
    },
    getCongitoCallbackUrl(codeFromJGTwitterOIDCBackend) {
      const cognitoRedirectUri = removeLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.cognitoRedirectUri);
      const cognitoJGTwitterOIDCState = removeLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.cognitoJGTwitterOIDCState);

      const scopeFromJGTwitterOIDCForCognito = removeLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.scopeFromCognito);

      const redirectUrlWithParams = new URL(cognitoRedirectUri); //always /oauth2/idpresponse
      redirectUrlWithParams.searchParams.append("state", cognitoJGTwitterOIDCState);
      redirectUrlWithParams.searchParams.append("code", codeFromJGTwitterOIDCBackend);
      redirectUrlWithParams.searchParams.append("scope", scopeFromJGTwitterOIDCForCognito);
      return redirectUrlWithParams.toString();
    },
    async processTwitterResponseAndRedirectToCognitoCallbackUrl() {
      const { codeFromTwitter, JGTwitterOIDCTwitterCodeVerifier } = this.processTwitterResponse();

      this.codeFromTwitter = codeFromTwitter;
      this.JGTwitterOIDCTwitterCodeVerifier = JGTwitterOIDCTwitterCodeVerifier;

      const codeFromJGTwitterOIDCBackend = await this.getCodeFromJGTwitterOIDCBackend(codeFromTwitter, JGTwitterOIDCTwitterCodeVerifier);
      window.location.href = this.getCongitoCallbackUrl(codeFromJGTwitterOIDCBackend);
    },
  },
};
</script>
