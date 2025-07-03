import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { UnchangingWalletData } from "../common/common";
import { WalletIdentifiers } from "@/data/wallet/walletServiceConstants";
import { delay } from "@/utils/wallet/wallet";

import walletMessages from "@/data/wallet/walletMessages";
import { Context } from "@/store/modules/wallet/walletModule";

const throwErrorIfNotWindowEhereum = () => {
  if (window.ethereum == null) {
    throw new Error(WalletIdentifiers.METAMASK + walletMessages.ERRORS.EXTENSION_NOT_INSTALLED);
  }
};
/**
 * work around open bug in metamask extension.
 */
export const waitingForMetamaskLoadOnNewTab = async (): Promise<void> => {
  throwErrorIfNotWindowEhereum();
  while (!window.ethereum.isConnected()) {
    console.log(walletMessages.INFO.WAITING_CONNECT_METAMASK_PROVIDER);
    await delay(500);
  }
  console.log(walletMessages.INFO.METAMASK_PROVIDER_CONNECTED);
};

export const initializeMetamaskAccountsChangedListenerAndGetInitialAccountsAddresses = async (
  accountsChangedHandler: any
): Promise<{
  accountsChangedCallback: any;
  metamaskAccountsAddresses: string[];
}> => {
  const accountsChangedCallback = async () => {
    const metamaskAccountsAddresses: string[] = await window.ethereum.request({ method: "eth_accounts" });
    accountsChangedHandler(metamaskAccountsAddresses);
  };
  window.ethereum.on("accountsChanged", accountsChangedCallback);
  const metamaskAccountsAddresses: string[] = await window.ethereum.request({
    method: "eth_accounts",
  });
  return { accountsChangedCallback, metamaskAccountsAddresses };
};

export const finishMetamaskAccountsChangedListener = (accountsChangedCallback: any) => {
  throwErrorIfNotWindowEhereum();
  window.ethereum.removeListener("accountsChanged", accountsChangedCallback);
};

export const connectAndObtainMetamaskAccountsThroughPermissionsRequest = async (): Promise<string[]> => {
  throwErrorIfNotWindowEhereum();
  const permissionsList = await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  });

  const ethAccountsPermission = permissionsList.find((permission: any) => permission.parentCapability === "eth_accounts");
  if (!ethAccountsPermission) {
    throw new Error(walletMessages.ERRORS.METAMASK_WALLET_REQUEST_PERMISSIONS_FAILED_NO_PERMISSION);
  }
  const accountsAddressesList = ethAccountsPermission.caveats[0]?.value;
  if (!accountsAddressesList) {
    throw new Error(walletMessages.ERRORS.METAMASK_WALLET_REQUEST_PERMISSIONS_FAILED);
  }
  return accountsAddressesList;
};
type SignatureOptions = {
  isDebug: boolean;
  debugMessageToSign: string;
};
/**
 * signs the message for sign in with metamask
 * @param signer
 * @param messageFields example: {protocol: "https://", domain: "jamgalaxy.singularitynet.io", from: signer.address, nonce: generatedNonceFromBackend, date: new Date().toISOString()}
 * @returns message signature
 */
const getMessageSignature = async (signer: JsonRpcSigner, messageFields: any, options?: SignatureOptions): Promise<string> => {
  let message;
  if (options?.isDebug && options?.debugMessageToSign) {
    message = options.debugMessageToSign;
  } else {
    message = `${messageFields.domain} wants you to sign in with your Ethereum account:\n${messageFields.from}\n\n${messageFields.info}\n\nURI: ${messageFields.protocol + messageFields.domain}\nVersion: ${messageFields.version}\nChain ID: ${messageFields.chainId}\nNonce: ${messageFields.nonce}\nIssued At: ${messageFields.date}`;
  }
  const signature = await signer.signMessage(message);

  if (options?.isDebug) {
    console.log("message=", message, "signature=", signature);
  }
  return signature;
};
export const getMetamaskAccountDataWithSignature = async (address: string, messageFields: any, options?: SignatureOptions): Promise<UnchangingWalletData> => {
  throwErrorIfNotWindowEhereum();
  const provider: BrowserProvider = new ethers.BrowserProvider(window.ethereum);
  const signer: JsonRpcSigner = await provider.getSigner(address);

  const { chainId: chainId } = await provider.getNetwork();
  const signature = await getMessageSignature(signer, { ...messageFields, chainId }, options);
  const unchangingWalletData: UnchangingWalletData = {
    address: address,
    signature: signature,
    walletExtensionIdentifier: WalletIdentifiers.METAMASK,
  };
  // accountDataWithSignature.push(unchangingWalletData);
  return {
    ...unchangingWalletData,
    chainId: Number(chainId),
  };
};

export const getEthereumWalletBalance = async (context: Context, walletExtensionIdentifier: WalletIdentifiers, address: string) => {
  switch (walletExtensionIdentifier) {
    case WalletIdentifiers.METAMASK: {
      throwErrorIfNotWindowEhereum();
      const provider: BrowserProvider = new ethers.BrowserProvider(window.ethereum);
      const balanceInWei = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balanceInWei);
      return balanceInEth;
    }
    case WalletIdentifiers.WEB3AUTH: {
      const balanceInEth = context.dispatch("web3auth/getBalance", undefined, { root: true });
      return balanceInEth;
    }
  }
};
