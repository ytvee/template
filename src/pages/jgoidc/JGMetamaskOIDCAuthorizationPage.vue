<template>
  <div class="oidc-metamask-authorization-page"></div>
</template>

<script>
import { WalletIdentifiers } from "@/data/wallet/walletServiceConstants";
import { connectAndObtainMetamaskAccountsThroughPermissionsRequest, getMetamaskAccountDataWithSignature } from "@/lib/ethereumWalletLib/ethereumWalletLib";
export default {
  name: "OIDCMetamaskAuthorizationPage",
  async created() {
    await this.$load(async () => {
      const { clientIdFromQueryParams, redirectUriFromQueryParams, scopeFromQueryParams, responseTypeFromQueryParams, stateFromQueryParams } = this.getSearchParamsReceivedFromCognito();
      const { address, signature, date, version, chainId, url } = await this.getAddressAndSignatureViaSigningMessageWithMetamask(); //TODO:

      const code = await this.exchangeAddressAndSignatureToCodeFromLambdaOIDC(address, signature, date, version, chainId, url);
      window.location.href = this.getCognitoCodeResponseRedirectUri(redirectUriFromQueryParams, stateFromQueryParams, code, scopeFromQueryParams);
    });
  },
  methods: {
    getSearchParamsReceivedFromCognito() {
      return {
        clientIdFromQueryParams: this.$route.query.client_id,
        redirectUriFromQueryParams: this.$route.query.redirect_uri,
        scopeFromQueryParams: this.$route.query.scope,
        responseTypeFromQueryParams: this.$route.query.response_type,
        stateFromQueryParams: this.$route.query.state,
      };
    },
    async getAddressAndSignatureViaSigningMessageWithMetamask() {
      const accountsAddresses = await connectAndObtainMetamaskAccountsThroughPermissionsRequest();
      const address = accountsAddresses[0];
      const payloadForNonceGeneration = {
        address: address,
      };
      const {
        data: { data: nonce },
      } = await this.$api.wallet.generateNonceForMessage(payloadForNonceGeneration);

      const messageFields = {
        protocol: `${window.location.protocol}//`,
        domain: `${window.location.hostname}`,
        from: address,
        info: "I accept the MetaMask Terms of Service: https://community.metamask.io/tos",
        nonce: nonce,
        date: new Date().toISOString(),
        version: 1, //TODO
      };
      const { signature, chainId } = await getMetamaskAccountDataWithSignature(address, messageFields, { isDebug: true });
      return { address, signature, date: messageFields.date, version: messageFields.version, chainId: chainId, url: `${messageFields.protocol + messageFields.domain}` };
    },
    async exchangeAddressAndSignatureToCodeFromLambdaOIDC(address, signature, date, version, chainId, url) {
      const payloadForObtainCode = {
        address,
        signature,
        date,
        version,
        chain_id: chainId.toString(),
        url,
        provider_name: WalletIdentifiers[WalletIdentifiers.METAMASK].toLowerCase(),
      };
      const result = await this.$api.jgoidc.validateSignatureAndGetCodeFromJGMetamaskOIDC(payloadForObtainCode);
      const codeFromLambdaOIDC = result.data.data;
      return codeFromLambdaOIDC;
    },
    getCognitoCodeResponseRedirectUri(redirectUri, state, code, scope) {
      const redirectUrlWithParams = new URL(redirectUri); //INFO: always /oauth2/idpresponse
      redirectUrlWithParams.searchParams.append("state", state);
      redirectUrlWithParams.searchParams.append("code", code);
      redirectUrlWithParams.searchParams.append("scope", scope);
      return redirectUrlWithParams.toString();
    },
  },
};
</script>
