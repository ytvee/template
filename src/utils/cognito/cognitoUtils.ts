import pkceChallenge from "pkce-challenge";
import { COGNITO_CONFIG } from "@/data/cognito/constants";
import { getLocalStorageSubEntry, setLocalStorageSubEntry, removeLocalStorageSubEntry, LocalStorageEntryName, CognitoLocalStorageSubEntryName } from "@/utils/browserStorages/browserStoragesUtils";

const RANDOM_VALUES_BYTE_COUNT = 10; //TODO: implement customizable length

import axios from "axios"; //TODO: use ApiInstance instead
/**
 *
 * @returns {Uint8Array} random number in Uint8Array
 */
function getRandomNumber(): string {
  return crypto.randomUUID();
}
export function getRandomState() {
  return getRandomNumber();
}
/**
 * Saves state and code_verifier in local storage and returns url to cognito.
 * @returns {string} url string which should be used to redirect to cognito.
 */
// export async function saveVerifiersAndGetCognitoRedirectURL(identityProvider: string): Promise<string> {
//   const authorizeStateString = getRandomState();
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.authorizeStateString, authorizeStateString);
//   const { code_verifier: codeVerifier, code_challenge: codeChallenge } = await pkceChallenge();
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoCodeVerifier, codeVerifier);

//   const redirectURLWithParams = new URL(`https://${COGNITO_CONFIG.domain}/oauth2/authorize`);
//   redirectURLWithParams.searchParams.append("response_type", "code");
//   redirectURLWithParams.searchParams.append("client_id", COGNITO_CONFIG.clientId);
//   redirectURLWithParams.searchParams.append("redirect_uri", COGNITO_CONFIG.redirectSignIn);
//   redirectURLWithParams.searchParams.append("state", Buffer.from(authorizeStateString).toString("base64"));
//   redirectURLWithParams.searchParams.append("scope", "");
//   redirectURLWithParams.searchParams.append("identity_provider", identityProvider);

//   redirectURLWithParams.searchParams.append("code_challenge_method", "S256");
//   redirectURLWithParams.searchParams.append("code_challenge", codeChallenge);

//   return redirectURLWithParams.toString();
// }

// export function checkAuthorizeState(authorizeStateStringFromLocalStorage: string, authorizeStateStringFromQueryParams: string, identityProviderName: string) {
//   if (authorizeStateStringFromLocalStorage !== authorizeStateStringFromQueryParams) {
//     throw new Error(`Saved authorize state must be equal to received from ${identityProviderName} authorize state! Try signin again!`);
//   }
// }
// export function saveCognitoTokensInLocalStorage(accessToken: string, idToken: string, refreshToken: string) {
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoAccessToken, accessToken);
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoIdToken, idToken);
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoRefreshToken, refreshToken);
// }
// export async function getCognitoTokensFromCode(codeFromQueryParams: string, stateFromQueryParams: string): Promise<{ accessToken: string; refreshToken: string; idToken: string }> {
//   const authorizeStateStringFromLocalStorage = getLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.authorizeStateString);

//   const authorizeStateStringFromQueryParams = Buffer.from(stateFromQueryParams, "base64").toString();
//   checkAuthorizeState(authorizeStateStringFromLocalStorage, authorizeStateStringFromQueryParams, "cognito");
//   removeLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.authorizeStateString); //the state has been checked and is no longer needed

//   const codeVerifierFromLocalStorage = getLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoCodeVerifier);

//   const payload = {
//     baseURI: `https://${COGNITO_CONFIG.domain}/oauth2/token`,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: {
//       grant_type: "authorization_code",
//       code: codeFromQueryParams,
//       client_id: COGNITO_CONFIG.clientId,
//       redirect_uri: COGNITO_CONFIG.redirectSignIn,
//       code_verifier: codeVerifierFromLocalStorage,
//     },
//   };

//   const cognitoResponse = await axios.post(payload.baseURI, payload.body, {
//     headers: payload.headers,
//   });
//   const { data: cognitoResponseData } = cognitoResponse;
//   const { id_token: idToken, access_token: accessToken, refresh_token: refreshToken } = cognitoResponseData;

//   saveCognitoTokensInLocalStorage(accessToken, idToken, refreshToken);
//   removeLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoCodeVerifier); //it is no longer needed

//   return { accessToken, refreshToken, idToken };
// }
// export async function getCognitoUserDetails() {
//   const origin = `https://${COGNITO_CONFIG.domain}/oauth2/userInfo`;
//   const payload = {
//     headers: {
//       Authorization: `Bearer ${getLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoAccessToken)}`,
//     },
//   };

//   const result = await axios.get(origin, {
//     headers: payload.headers,
//   });
//   const user = result.data;
//   return user;
// }
// export async function refreshCognitoTokens() {
//   //TODO: do not use! use Amplify session refresh instead
//   console.log("refreshCognitoTokens: start");

//   const payload = {
//     baseURI: `https://${COGNITO_CONFIG.domain}/oauth2/token`,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: {
//       grant_type: "refresh_token",
//       refresh_token: getLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoRefreshToken),
//       client_id: COGNITO_CONFIG.clientId,
//     },
//   };

//   const cognitoResponse = await axios.post(payload.baseURI, payload.body, {
//     headers: payload.headers,
//   });
//   const { data: cognitoResponceData } = cognitoResponse;
//   const { id_token: idToken, access_token: accessToken } = cognitoResponceData;
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoAccessToken, accessToken);
//   setLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoIdToken, idToken);
//   return { accessToken, idToken };
// }

/* sign out */
// export async function signOutWithCognito(): Promise<void> {
//   const cognitoRefreshToken = getLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoRefreshToken);
//   localStorage.removeItem(LocalStorageEntryName.cognito);
//   const origin = `https://${COGNITO_CONFIG.domain}/oauth2/revoke`;
//   const payload = {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: {
//       token: cognitoRefreshToken,
//       client_id: COGNITO_CONFIG.clientId,
//     },
//   };
//   await axios.post(origin, payload.body, {
//     headers: payload.headers,
//   });

//   const logoutUrl = new URL(`https://${COGNITO_CONFIG.domain}/logout`);
//   logoutUrl.searchParams.append("client_id", COGNITO_CONFIG.clientId);
//   logoutUrl.searchParams.append("logout_uri", COGNITO_CONFIG.callbackLogoutUrl);
//   window.location.href = logoutUrl.toString();
// }
/* /sign out */

/* Amplify utils */
import { Amplify, ResourcesConfig } from "aws-amplify";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
// import { aws_config } from "@/data/cognito/constants";
import router from "@/router";
import { JGOIDCRoutesPaths } from "@/router/index";

// export function initializeAmplify() {
//   Amplify.configure(aws_config as ResourcesConfig);
//   Hub.listen("auth", async ({ payload }) => {
//     console.log("Hub: event received=", payload);
//     switch (payload.event) {
//       case "signInWithRedirect":
//         console.log("signInWithRedirect: start");
//         break;
//       case "signInWithRedirect_failure":
//         console.log("signInWithRedirect_failure event", payload.data);
//         break;
//       case "signedIn": {
//         console.log("signedIn: start");
//         const tokens = await completeInflightFlowAndGetTokensFromAmplify();
//         console.log("tokens from amplify=", tokens);
//         console.log("redirecting...");
//         router.push("/artists");
//         break;
//       }
//       case "signedOut": {
//         console.log("signedOut: start");
//         break;
//       }
//     }
//   });
// }
// export function getRefreshTokenFromLocalStorage() {
//   const lastUserKey = `CognitoIdentityServiceProvider.${aws_config.Auth.Cognito.userPoolClientId}.LastAuthUser`;
//   const lastUser = localStorage.getItem(lastUserKey);
//   const refreshTokenKey = `CognitoIdentityServiceProvider.${aws_config.Auth.Cognito.userPoolClientId}.${lastUser}.refreshToken`;
//   const refreshToken = localStorage.getItem(refreshTokenKey);
//   return refreshToken;
// }
// export async function completeInflightFlowAndGetTokensFromAmplify() {
/**
 * work around Amplify inflight flow implementation
 * */
// export async function completeInflightFlowAndGetTokensFromAmplify() {
//   if (JGOIDCRoutesPaths.find((path) => path === window.location.pathname)) {
//     return {
//       idToken: null, //INFO: toString() method allows to obtain jwt tokens in base64 with signature. Not object. Method overriding.
//       accessToken: null,
//       refreshToken: null,
//     };
//   }

//   await import("aws-amplify/auth/enable-oauth-listener"); //INFO: DO NOT REMOVE!!! this import must be presented if we want to listen auth events with hub https://docs.amplify.aws/gen1/react/build-a-backend/auth/add-social-provider/#required-for-multi-page-applications-complete-social-sign-in-after-redirect
//   //we cannot call import in our main.ts app file because our oidc wrapper is hosted on the same domain (it is the part of this project) as main project and it cause to false positive of Amplify oauth flow complete method.

//   const session = await fetchAuthSession(); //This method call can cause dead lock. So import('aws-amplify/auth/enable-oauth-listener') must be called before fetchAuthSession.
//   const idToken = session?.tokens?.idToken;

//   console.log("idToken=", idToken);

//   const accessToken = session?.tokens?.accessToken;

//   const refreshToken = getRefreshTokenFromLocalStorage();
//   console.log("completeInflightFlowAndGetTokensFromAmplify: end");

//   return {
//     idToken: idToken?.toString() ?? null, //INFO: toString() method allows to obtain jwt tokens in base64 with signature. Not object. Method overriding.
//     accessToken: accessToken?.toString() ?? null,
//     refreshToken: refreshToken,
//   };
// }
// export async function signOutWithCognito(): Promise<void> {
//   await signOut();
// }

/* /Amplify utils */

//----------------test---------------------------//

//----------------/test---------------------------//
