import jgoidcEndpoints from "@/data/api/jgoidc/jgoidcEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { AxiosInstance, AxiosResponse } from "axios";
const JGOIDC_AUTHORIZATION_API = process.env.VUE_APP_AUTHORIZATION_API;

export default function (instance: AxiosInstance): APIModule {
  
  return {
    /* JG Metamask OIDC backend methods*/
    validateSignatureAndGetCodeFromJGMetamaskOIDC(payload: object): Promise<AxiosResponse> {
      return instance.post(JGOIDC_AUTHORIZATION_API + jgoidcEndpoints.VALIDATE_SIGNATURE_AND_GET_CODE_FROM_JG_METAMASK_OIDC, payload);
    },
    /* /JG Metamask OIDC backend methods*/
    /* JG Twitter OIDC backend methods*/
    getJGTwitterOIDCCode(payload: object): Promise<AxiosResponse> {
      return instance.post(JGOIDC_AUTHORIZATION_API + jgoidcEndpoints.GET_JG_TWITTER_OIDC_CODE, payload);
    },
    /* /JG Twitter OIDC backend methods*/
  };
}
