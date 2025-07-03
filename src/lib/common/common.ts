import { WalletIdentifiers } from "@/data/wallet/walletServiceConstants";

export {};
declare global {
  interface Window {
    // ethereum: Eip1193Provider & BrowserProvider; //Not working with isConnected
    // eslint-disable-next-line
    ethereum: any;
    // eslint-disable-next-line
    cardano: any;
  }
}

export interface UnchangingWalletData {
  id?: number;
  address: string;
  signature?: string; //signature of some messeage which user have to sign.
  key?: string; //comes with signature on message sign only in cardano blockchain
  walletExtensionIdentifier: WalletIdentifiers;
  stakeKey?: string;
  chainId?: number;
}
export type SignatureValidationFields = {
  protocol: string;
  domain: string;
  info: string;
  date: string;

  from?: string;
  nonce?: string;
  version?: number;
  chainId?: number;
};
export interface ChangingWalletData {
  isExtensionConnectedToSite?: boolean; //INFO: If extension is connected to site and this extension has account with address equal to stored address also connected to site.
  balance?: number; //TODO: point the measure units
  isLoading?: boolean;
  lastUpdateTime?: number; //TODO: may be we need this field
}
export type WalletData = UnchangingWalletData & ChangingWalletData;
