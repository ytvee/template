import userEndpoints from "@/data/api/user/userEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { AxiosInstance, AxiosResponse } from "axios";
import tokens from "@/data/tokens/tokens.json";
import { globals } from "@/main";

export default function (instance: AxiosInstance): APIModule {
  return {
    signIn(payload: object): Promise<AxiosResponse> {
      console.log("trying to sign in with body: ", payload);
      return instance.post(userEndpoints.LOGIN, payload);
    },
    signUp(payload: object): Promise<AxiosResponse> {
      console.log("trying to sign up with body: ", payload);
      return instance.post(userEndpoints.REGISTER, payload);
    },
    googleAuth(payload: object): Promise<AxiosResponse> {
      console.log("trying to google auth with body: ", payload);
      return instance.post(userEndpoints.GOOGLE_AUTH, payload);
    },
    logout(refreshToken: string): Promise<AxiosResponse> {
      globals.$api.removeHeader(tokens.AUTHORIZATION); // TODO move to the call
      return instance.delete(userEndpoints.LOGOUT, {
        data: { "refresh-token": refreshToken },
      });
    },
    getAvaliableTags(): Promise<AxiosResponse> {
      console.log("trying to get tags... ");
      return instance.get(userEndpoints.GET_TAGS);
    },
    finalSignUpSteps(payload: object): Promise<AxiosResponse> {
      console.log("trying to send final sign up steps data with body: ", payload);
      return instance.post(userEndpoints.FINAL_SIGN_UP_STEPS, payload);
    },
  };
}
