import walletEndpoints from "@/data/api/wallet/walletEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { Axios, AxiosResponse } from "axios";

export default function (instance: Axios): APIModule {
  return {
    generateNonceForMessage(payload: object): Promise<AxiosResponse> {
      console.log("generateNonceForMessage: payload=", payload);
      return instance.post(walletEndpoints.GENERATE_NONCE_FOR_MESSAGE, payload);
    },
    addWallet(payload: object): Promise<AxiosResponse> {
      console.log("addWallet: payload=", payload);
      return instance.post(walletEndpoints.ADD_WALLET, payload);
    },
    getUserWallets(): Promise<AxiosResponse> {
      console.log("getUserWallets: start");
      return instance.get(walletEndpoints.GET_USER_WALLETS);
    },
    deleteWallet(wallet_id: number): Promise<AxiosResponse> {
      console.log("deleteWallet: wallet_id=", wallet_id);
      return instance.delete(walletEndpoints.DELETE_WALLET, {
        params: { wallet_id },
      });
    },
  };
}
