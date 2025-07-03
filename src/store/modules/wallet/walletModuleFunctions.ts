import { BlockchainIdentifiers, WalletIdentifiers } from "@/data/wallet/walletServiceConstants";
import walletMessages from "@/data/wallet/walletMessages";

import { Context, UserWalletsInBlockchain, WalletState } from "./walletModule";
import { SignatureValidationFields, UnchangingWalletData, WalletData } from "@/lib/common/common";
import { connectAndObtainMetamaskAccountsThroughPermissionsRequest, getMetamaskAccountDataWithSignature } from "@/lib/ethereumWalletLib/ethereumWalletLib";

import { ExtensionWalletData, connectCardanoWalletAndGetExtensionWalletData, getCardanoAccountDataWithSignature } from "@/lib/cardanoWalletLib/cardanoWalletLib";
import { getWeb3AuthAccountDataWithSignature } from "@/lib/web3AuthLib/web3AuthLib";
import { ApiPlugin } from "@/plugins/api/ApiPlugin";

/* helper functions */
const getAccountsAddressesNotConnectedToUserAccount = (alreadyConnectedToAccountWallets: WalletData[], accountsAddressesList: string[], addedFromExtensionIdentifier: WalletIdentifiers): string[] => {
  const walletsNotConnectedToUserAccount: string[] = accountsAddressesList.filter((addedAddress) => {
    return !alreadyConnectedToAccountWallets.find((existingWallet) => {
      return addedFromExtensionIdentifier === existingWallet.walletExtensionIdentifier && addedAddress === existingWallet.address;
    });
  });
  return walletsNotConnectedToUserAccount;
};

const isCardanoAccountConnectedToUserAccount = (alreadyConnectedToAccountWallets: WalletData[], accountToAdd: ExtensionWalletData): boolean => {
  //check if account is already connected to user platform account. Simply check address. Exact checks with stake key are provided by platform backend
  const result = alreadyConnectedToAccountWallets.some((alreadyConnectedWallet) => {
    return alreadyConnectedWallet.walletExtensionIdentifier === accountToAdd.walletExtensionIdentifier && alreadyConnectedWallet.address === accountToAdd.address;
  });

  return result;
};
export function isWalletExcluded(wallet: WalletData, options?: { excludedWalletIdentifiers: Array<WalletIdentifiers> }) {
  return options && options.excludedWalletIdentifiers && options.excludedWalletIdentifiers.find((excludedWalletIdentifier) => excludedWalletIdentifier === wallet.walletExtensionIdentifier);
}
/* /helper functions */

/* functions for store actions */
export function parseLoadedFromBackendWalletsToUserWalletsInBlockchain(walletsFromBackend: any, blockchainIdentifier: BlockchainIdentifiers): UserWalletsInBlockchain {
  const filteredWallets = walletsFromBackend.filter((wallet: any) => wallet.network === BlockchainIdentifiers[blockchainIdentifier]);
  const mappedWalelts: UserWalletsInBlockchain = {
    blockchainIdentifier: blockchainIdentifier,
    wallets: filteredWallets.map((wallet: any) => ({
      id: wallet.id,
      address: wallet.address,
      walletExtensionIdentifier: wallet.provider_name.toUpperCase(),
    })),
  };
  return mappedWalelts;
}
export const connectEthereumWalletByWalletId = async (context: Context, alreadyConnectedToAccountWallets: WalletData[], walletIdentifier: WalletIdentifiers): Promise<Array<{ unchangingWalletData: UnchangingWalletData; signatureValidationFields: SignatureValidationFields }>> => {
  switch (walletIdentifier) {
    case WalletIdentifiers.METAMASK: {
      const accountsAddresses: string[] = await connectAndObtainMetamaskAccountsThroughPermissionsRequest();
      const accountsAddressesNotConnectedToUserAccount: string[] = getAccountsAddressesNotConnectedToUserAccount(alreadyConnectedToAccountWallets, accountsAddresses, walletIdentifier);
      if (!accountsAddressesNotConnectedToUserAccount.length) {
        throw new Error(walletMessages.INFO.WALLET_ALREADY_CONNECTED(walletIdentifier, accountsAddresses[0]));
      }
      // const walletDataForAddWalletList: UnchangingWalletData[] = [];
      const walletDataForAddWalletList: Array<{ unchangingWalletData: UnchangingWalletData; signatureValidationFields: SignatureValidationFields }> = [];
      for (let i = 0; i < accountsAddressesNotConnectedToUserAccount.length; i++) {
        const payloadForNonceGeneration = {
          address: accountsAddressesNotConnectedToUserAccount[i],
        };

        const {
          data: { data: nonce },
        } = await ApiPlugin.getInstance().wallet.generateNonceForMessage(payloadForNonceGeneration);
        const messageFields = {
          protocol: `${window.location.protocol}//`,
          domain: `${window.location.hostname}`,
          from: accountsAddressesNotConnectedToUserAccount[i],
          info: "I accept the MetaMask Terms of Service: https://community.metamask.io/tos",
          nonce: nonce, //INFO: nonce should be formed with eight 8 digits in purpose of match metamask sign in message format
          date: new Date().toISOString(),
          version: 1, //TODO:
        };
        const metamaskAccountDataWithSignature: UnchangingWalletData = await getMetamaskAccountDataWithSignature(accountsAddressesNotConnectedToUserAccount[i], messageFields);
        const signatureValidationFields: SignatureValidationFields = {
          info: messageFields.info,
          date: messageFields.date,
          protocol: messageFields.protocol,
          domain: messageFields.domain,
        };
        walletDataForAddWalletList.push({ unchangingWalletData: metamaskAccountDataWithSignature, signatureValidationFields });
      }
      return walletDataForAddWalletList;
    }
    case WalletIdentifiers.WEB3AUTH: {
      console.log("connectEthereumWalletByWalletId: web3auth");

      const accountsAddresses: string[] = await context.dispatch("web3auth/getAccounts", undefined, { root: true }); //TODO: get account from Web3Auth
      const accountsAddressesNotConnectedToUserAccount: string[] = getAccountsAddressesNotConnectedToUserAccount(alreadyConnectedToAccountWallets, accountsAddresses, WalletIdentifiers.WEB3AUTH);
      if (!accountsAddressesNotConnectedToUserAccount.length) {
        console.log(walletMessages.INFO.WALLET_ALREADY_CONNECTED(walletIdentifier, accountsAddresses[0]));
        return [];
      }

      const address = accountsAddresses[0]; //TODO:
      const payloadForNonceGeneration = {
        address,
      };
      const {
        data: { data: nonce },
      } = await ApiPlugin.getInstance().wallet.generateNonceForMessage(payloadForNonceGeneration);
      const messageFields = {
        protocol: `${window.location.protocol}//`,
        domain: `${window.location.hostname}`,
        from: address,
        info: "I accept the MetaMask Terms of Service: https://community.metamask.io/tos",
        nonce: nonce, //INFO: nonce should be formed with eight 8 digits in purpose of match metamask sign in message format
        date: new Date().toISOString(),
        version: 1, //TODO:
      };
      const web3AuthAccountDataWithSignature: UnchangingWalletData = await getWeb3AuthAccountDataWithSignature(context, address, messageFields);
      console.log("web3AuthAccountDataWithSignature=", web3AuthAccountDataWithSignature);

      const signatureValidationFields: SignatureValidationFields = {
        info: messageFields.info,
        date: messageFields.date,
        protocol: messageFields.protocol,
        domain: messageFields.domain,
      };
      const walletDataForAddWalletList: Array<{ unchangingWalletData: UnchangingWalletData; signatureValidationFields: SignatureValidationFields }> = [{ unchangingWalletData: web3AuthAccountDataWithSignature, signatureValidationFields }];
      return walletDataForAddWalletList;
    }
    // case walletsIdentifiers.WALLETCONNECT: {

    //     break;
    // }
    default: {
      throw new Error(walletMessages.ERRORS.UNKNOWN_WALLET_INEDTIFIER);
    }
  }
};
export const connectCardanoWalletByWalletId = async (alreadyConnectedToAccountWallets: WalletData[], walletIdentifier: string): Promise<{ unchangingWalletData: UnchangingWalletData; signatureValidationFields: SignatureValidationFields }> => {
  switch (walletIdentifier) {
    case WalletIdentifiers.NAMI: //CIP-0030 standard wallets
    case WalletIdentifiers.ETERNL:
    case WalletIdentifiers.GEROWALLET:
    case WalletIdentifiers.FLINT:
    case WalletIdentifiers.CARDWALLET:
    case WalletIdentifiers.YOROI: {
      const extensionWalletData: ExtensionWalletData = await connectCardanoWalletAndGetExtensionWalletData(walletIdentifier);

      if (isCardanoAccountConnectedToUserAccount(alreadyConnectedToAccountWallets, extensionWalletData)) {
        throw new Error(walletMessages.INFO.WALLET_ALREADY_CONNECTED(extensionWalletData.walletExtensionIdentifier, extensionWalletData.address));
      }
      const messageFields: SignatureValidationFields = {
        //TODO:
        protocol: `${window.location.protocol}//`,
        domain: `${window.location.hostname}`,
        from: extensionWalletData.address,
        info: "I accept the Jam Galaxy Terms of Service: https://jamgalaxy.singularitynet.io/",
        nonce: "nonce123", //TODO:
        date: new Date().toISOString(),
        version: 1, //TODO:
      };
      const unchangingWalletData: UnchangingWalletData = await getCardanoAccountDataWithSignature(extensionWalletData, messageFields);

      console.log("unchangingWalletData=", unchangingWalletData);

      return { unchangingWalletData, signatureValidationFields: messageFields };
    }
    // case someWalletNotSupportCIP0030: //write here any wallet which does not support CIP-0030 standard and which you want to connect
    default:
      throw new Error(walletIdentifier + walletMessages.ERRORS.UNKNOWN_WALLET_INEDTIFIER);
  }
};
/* /functions for store actions */

/* functions for store mutations */
export const computeIsExtensionConnectedToSite = (state: WalletState) => {
  const ethereumIndex = state.userWallets.findIndex((blockchain) => {
    return blockchain.blockchainIdentifier === BlockchainIdentifiers.EVM;
  });
  if (ethereumIndex !== -1) {
    state.userWallets[ethereumIndex].wallets.forEach((wallet) => {
      if (
        wallet.walletExtensionIdentifier === WalletIdentifiers.METAMASK &&
        state.metamaskAccountsAddresses.find((address) => {
          return address === wallet.address;
        })
      ) {
        wallet.isExtensionConnectedToSite = true;
      } else {
        wallet.isExtensionConnectedToSite = false;
      }
    });
  }
};
/* /functions for store mutations */

/* helper */
export function getWalletsByBlockchainIdentifierExtensionIdentifier(userWallets: UserWalletsInBlockchain[], blockchainIdentifier: BlockchainIdentifiers, walletIdentifier: WalletIdentifiers) {
  let wallets: WalletData[] = [];

  console.log("getWalletsByBlockchainIdentifierExtensionIdentifier: userWallets=", userWallets);

  const userWalletsInBlockchain = userWallets.find((userWalletsInBlockchain) => userWalletsInBlockchain.blockchainIdentifier === blockchainIdentifier);
  if (userWalletsInBlockchain) {
    wallets = userWalletsInBlockchain.wallets.filter((wallet) => wallet.walletExtensionIdentifier === walletIdentifier);
  }
  return wallets;
}
/* /helper */
