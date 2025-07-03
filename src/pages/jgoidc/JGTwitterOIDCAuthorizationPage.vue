<template>
  <div class="oidc-twitter-authorization-page"></div>
</template>

<script>
import pkceChallenge from "pkce-challenge";
import { TWITTER_CONFIG } from "@/data/cognito/constants";
import { getRandomState } from "@/utils/cognito/cognitoUtils";
import { setLocalStorageSubEntry, LocalStorageEntryName, JGTwitterOIDCLocalStorageSubEntryName } from "@/utils/browserStorages/browserStoragesUtils";
export default {
  name: "OIDCTwitterAuthorizationPage",
  async created() {
    await this.$load(async () => {
      await this.processParamsFromCognitoAndRedirectToTwitterAuthorizeUrl();
    });
  },
  methods: {
    getParamsForJGTwitterOIDCFromCognito() {
      const JGTwitterOIDCClientId = this.$route.query.client_id; //INFO: the client_id of our proxy oidc application for Twitter.
      const cognitoRedirectUri = this.$route.query.redirect_uri; //INFO: constantly "/idpresponce" in fact
      const scopeFromCognitoForJGTwitterOIDC = this.$route.query.scope; //INFO: scope from cognito. Most likely contains "openid"
      const responseTypeFromQueryParams = this.$route.query.response_type; //INFO: constantly "code"
      const cognitoJGTwitterOIDCState = this.$route.query.state; //INFO: Most likely very long string. 680+ characters.
      return { JGTwitterOIDCClientId, cognitoRedirectUri, scopeFromCognitoForJGTwitterOIDC, responseTypeFromQueryParams, cognitoJGTwitterOIDCState };
    },
    /**
     * The purpose of this method is workaround Cogntio identity provider settings limitations. Cognito requires the "openid" scope field to be set. But Twitter cannot receive this scope field
     * @param {string} scopeString scope string which our oidc received from Cognito.
     * @param {Array<string>} fieldsToRemove fields which will be removed from this string. Usage example: ["openid", "some_scope_field_you_want_to_remove"]
     */
    removeFieldsFromScopeString(scopeString, fieldsToRemove) {
      let removedScopeFieldsString = "";
      const scope = scopeString
        .split(" ")
        .filter((scopeItem) => {
          if (fieldsToRemove.findIndex((fieldToRemove) => fieldToRemove === scopeItem) === -1) {
            return true;
          } else {
            removedScopeFieldsString += scopeItem + " ";
            return false;
          }
        })
        .join(" ");

      return {
        scope,
        removedScopeFieldsString: removedScopeFieldsString.trim(),
      };
    },
    saveParamsForJGTwitterOIDCFromCognito(cognitoRedirectUri, cognitoJGTwitterOIDCState, scopeFromCognito) {
      setLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.cognitoRedirectUri, cognitoRedirectUri);
      setLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.cognitoJGTwitterOIDCState, cognitoJGTwitterOIDCState);
      setLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.scopeFromCognito, scopeFromCognito);
    },
    processParamsFromCognito() {
      const { cognitoRedirectUri, cognitoJGTwitterOIDCState, scopeFromCognitoForJGTwitterOIDC } = this.getParamsForJGTwitterOIDCFromCognito();
      const { scope, removedScopeFieldsString } = this.removeFieldsFromScopeString(scopeFromCognitoForJGTwitterOIDC, TWITTER_CONFIG.scopeFieldsToRemoveFromCognitoScope);
      this.saveParamsForJGTwitterOIDCFromCognito(cognitoRedirectUri, cognitoJGTwitterOIDCState, scopeFromCognitoForJGTwitterOIDC);

      return scope;
    },
    async saveJGTwitterOIDCVerifiersForTwitterAndGetTwitterAuthorizeURL(scopeForTwitterFromJGTwitterOIDC) {
      const JGTwitterOIDCTwitterState = getRandomState();
      setLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.JGTwitterOIDCTwitterState, JGTwitterOIDCTwitterState);

      const { code_verifier: codeVerifier, code_challenge: codeChallenge } = await pkceChallenge();
      setLocalStorageSubEntry(LocalStorageEntryName.JGTwitterOIDC, JGTwitterOIDCLocalStorageSubEntryName.JGTwitterOIDCTwitterCodeVerifier, codeVerifier);

      const twitterAuthorizationUrl = new URL(TWITTER_CONFIG.twitterAuthorizationUrl);
      twitterAuthorizationUrl.searchParams.append("response_type", "code");
      twitterAuthorizationUrl.searchParams.append("client_id", TWITTER_CONFIG.clientId);
      twitterAuthorizationUrl.searchParams.append("redirect_uri", TWITTER_CONFIG.JGTwitterOIDCCallback);
      twitterAuthorizationUrl.searchParams.append("state", Buffer.from(JGTwitterOIDCTwitterState).toString("base64"));

      twitterAuthorizationUrl.searchParams.append("code_challenge_method", "S256");
      twitterAuthorizationUrl.searchParams.append("code_challenge", codeChallenge);
      twitterAuthorizationUrl.searchParams.append("scope", scopeForTwitterFromJGTwitterOIDC);

      const url = twitterAuthorizationUrl.toString();
      return url;
    },
    async processParamsFromCognitoAndRedirectToTwitterAuthorizeUrl() {
      const scopeForTwitterFromJGTwitterOIDC = this.processParamsFromCognito();
      // const scopeForTwitterFromJGTwitterOIDC = "tweet.read users.read follows.read offline.access";
      window.location.href = await this.saveJGTwitterOIDCVerifiersForTwitterAndGetTwitterAuthorizeURL(scopeForTwitterFromJGTwitterOIDC);
    },
  },
};
</script>
