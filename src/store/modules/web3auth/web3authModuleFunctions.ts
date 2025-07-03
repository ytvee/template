// ID token from google
import { googleSdkLoaded } from "vue3-google-login";
import { GOOGLE_OAUTH2_CLIENT_ID, WEB3AUTH_CLIENT_ID, WEB3AUTH_VERIFIER, WEB3AUTH_NETWORK_ID, EVM_CHAIN_CONFIG } from "@/data/web3auth/constants";

import Web3AuthSingleFactorAuth from "@web3auth/single-factor-auth";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { parseToken } from "@web3auth/mpc-core-kit";

function initializeIdGoogle(google: any): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    google.accounts.id.initialize({
      //TODO: reject
      client_id: GOOGLE_OAUTH2_CLIENT_ID,
      callback: (response: any) => {
        resolve(response);
      },
      auto_select: true, // Attempts to automatically select an account if possible
    });
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Tooltip not displayed or missing, show modal window or message
        console.error("Login prompt could not be displayed.");
        // Here you can implement logic to open a modal login window or prompt to login
        // this.initializeOAuth2Google(google);
        // this.initializeIdGoogle(google); //recursion
      }
    });
  });

  return promise;
}
function initializeOAuth2Google(google: any): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: GOOGLE_OAUTH2_CLIENT_ID,
        scope: "email profile openid",
        ux_mode: "popup",
        callback: (response: any) => {
          resolve(response);
        },
      })
      .requestAccessToken();
  });
  return promise;
}
function getIdTokenFromGoogle(): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    googleSdkLoaded(async (google) => {
      await initializeOAuth2Google(google);
      const result = await initializeIdGoogle(google);
      const credential = result.credential;
      resolve(credential);
    });
  });
  return promise;
}
// /ID token from google

export async function getIdTokenFromSocialProvider(socialProviderName: string): Promise<string> {
  //TODO: more social providers
  switch (socialProviderName) {
    case "google": {
      const idToken = await getIdTokenFromGoogle();
      return idToken;
    }
    case "farcaster": {
      return "farcaster"; //TODO:
    }
    default: {
      throw new Error("Unknown social provider!");
    }
  }
}

export async function getSocialMFAFactorKey(socialProviderName: string): Promise<string> {
  // Initialise the Web3Auth SFA SDK
  // You can do this on the constructor as well for faster experience
  const web3authSfa = new Web3AuthSingleFactorAuth({
    clientId: WEB3AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
    web3AuthNetwork: WEB3AUTH_NETWORK_ID,
    usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
  });
  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig: EVM_CHAIN_CONFIG },
  });
  await web3authSfa.init(privateKeyProvider);

  const idToken = await getIdTokenFromSocialProvider(socialProviderName);
  const userInfo = parseToken(idToken);

  // Use the Web3Auth SFA SDK to generate an account using the Social Factor
  const web3authProvider = await web3authSfa.connect({
    verifier: WEB3AUTH_VERIFIER,
    verifierId: userInfo.email,
    idToken,
  });

  // Get the private key using the Socials Factor, which can be used as a factor key for the MPC Core Kit
  const factorKey = await web3authProvider!.request({
    method: "private_key",
  });
  return factorKey as string;
}
