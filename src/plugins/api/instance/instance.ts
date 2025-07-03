import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosHeaderValue } from "axios";
import { LocalStorageEntryName, CognitoLocalStorageSubEntryName, setLocalStorageSubEntry, getLocalStorageSubEntry } from "@/utils/browserStorages/browserStoragesUtils";
// import { completeInflightFlowAndGetTokensFromAmplify, refreshCognitoTokens } from "@/utils/cognito/cognitoUtils";
import { base64ToArrayBuffer } from "@audioeditor/utils/audioUtils";

import store from "@/store/store";
import { instanceMessages } from "@/data/api/constants";

export interface IGenerateResponse {
  settings: Record<string, any>;
  notes: Map<string, ArrayBuffer>;
}

enum Headers {
  AUTHORIZATION = "Authorization",
}

export class APIInstance {
  protected instance: AxiosInstance;
  // private refreshTokenPromise: Promise<{ accessToken: string; idToken: string }> | null;
  // private logoutPromise: Promise<void> | null;

  constructor(instanceConfiguration: AxiosRequestConfig) {
    this.instance = axios.create(instanceConfiguration);
    // this.refreshTokenPromise = null;
    // this.logoutPromise = null;
    // this.configureRequestInterception();
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  // public async autoConfigure(): Promise<void> {
  //   // const authToken = getLocalStorageSubEntry(LocalStorageEntryName.cognito, CognitoLocalStorageSubEntryName.cognitoIdToken);
  //   const tokens = await completeInflightFlowAndGetTokensFromAmplify();
  //   const authToken = tokens.accessToken;
  //   authToken && this.setHeader(Headers.AUTHORIZATION, authToken);
  // }

  public removeHeader(headerKey: string): void {
    delete this.instance.defaults.headers.common[headerKey];
  }

  public setHeader(headerKey: string, headerValue: string): void {
    this.instance.defaults.headers.common[headerKey] = headerValue;
  }

  public getHeader(headerKey: string): AxiosHeaderValue | undefined {
    return this.instance.defaults.headers.common[headerKey];
  }

  /* helpers */
  // private async createNewUpdateTokensPromise(): Promise<{ accessToken: string; idToken: string }> {
  //   // const { accessToken, idToken } = await refreshCognitoTokens();
  //   const { accessToken, idToken } = await completeInflightFlowAndGetTokensFromAmplify();
  //   if (!accessToken || !idToken) {
  //     throw new Error("update tokens from Amplify failed");
  //   }
  //   this.refreshTokenPromise = null;
  //   return { accessToken, idToken };
  // }
  async tokenUpdateFailedErrorHandler(): Promise<void> {
    await store.dispatch("user/signOutUser");
  }
  /**
   *
   * @param error error from called axios request
   * @returns response of original request if authorization error was successfuly handled or null otherwise
   */
  // private async unauthorizedErrorHandler(error: AxiosError): Promise<AxiosResponse | null> {
  //   console.log(instanceMessages.INFO.INVALID_AUTHORIZATION); //TODO: make file with string constants
  //   if (!this.refreshTokenPromise) {
  //     console.log(instanceMessages.INFO.GETTING_NEW_AUTHORIZATION_TOKEN);
  //     this.refreshTokenPromise = this.createNewUpdateTokensPromise();
  //   }
  //   try {
  //     const { accessToken, idToken } = await this.refreshTokenPromise;
  //     this.setHeader(Headers.AUTHORIZATION, accessToken);
  //     const newConfig = error.config;
  //     if (newConfig) {
  //       newConfig.headers[Headers.AUTHORIZATION] = accessToken;
  //       return await this.instance.request(newConfig);
  //     }
  //   } catch (error) {
  //     if (!this.logoutPromise) {
  //       this.logoutPromise = this.tokenUpdateFailedErrorHandler();
  //       await this.logoutPromise;
  //       this.logoutPromise = null;
  //     }
  //   }
  //   return null;
  // }
  /* /helpers */

  // private configureRequestInterception() {
  //   this.instance.interceptors.response.use(
  //     (response: AxiosResponse) => response,
  //     async (error: AxiosError) => {
  //       if (error.config && error?.response?.status === 401) {
  //         return await this.unauthorizedErrorHandler(error);
  //       } else {
  //         throw error;
  //       }
  //     }
  //   );
  // }
}

export async function generateNoteSamples(
  prompt: string,
  tags: string[],
  token?: string
): Promise<IGenerateResponse | null> {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_GENERATE_API_BASE_URL}${process.env.VUE_APP_GENERATE_API_ROUTE ||
      "/generate_audio"}`,
      {
        prompt: prompt,
        styles: tags.join(", "),
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    const {
      vst_settings: alternativeVstSettings,
      vstSettings,
      ...notesBase64
    } = response.data as Record<string, any>;

    const notes = new Map<string, ArrayBuffer>();
    Object.entries<string>(notesBase64).forEach(([key, value]) => {
      if (key.length > 2) return;
      const arrayBuffer = base64ToArrayBuffer(value);
      notes.set(key, arrayBuffer);
    });

    const settingsJson = vstSettings || alternativeVstSettings;
    const settings: Record<string, any> = settingsJson
      ? JSON.parse(settingsJson)
      : {};

    return { settings, notes };
  } catch (err) {
    console.error("Audio generation error:", err);
    return null;
  }
}