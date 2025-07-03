import { Address, Value } from "@emurgo/cardano-serialization-lib-asmjs";
import { SignatureValidationFields, UnchangingWalletData } from "../common/common";
import { WalletIdentifiers } from "@/data/wallet/walletServiceConstants";
import walletMessages from "@/data/wallet/walletMessages";
import { delay } from "@/utils/wallet/wallet";

const COIN_FRACTIONAL_DIGITS_COUNT = 6;
const MAX_ATTEMPTS_TO_OBTAIN_CARDANO = 30;

export type ExtensionWalletData = {
  //Data type, which used on return data matched from extension on wallet connect
  networkId: number;
  stakeKey: string;
  address: string;
  walletExtensionIdentifier: WalletIdentifiers;
};

const supportedWalletsIdentifiers: string[] = [WalletIdentifiers.NAMI, WalletIdentifiers.ETERNL, WalletIdentifiers.GEROWALLET, WalletIdentifiers.FLINT, WalletIdentifiers.CARDWALLET, WalletIdentifiers.YOROI];

const decodeAddress = (address: any) => {
  return Address.from_bytes(Buffer.from(address, "hex")).to_bech32();
};
const decodeBalanceHelper = (encodedBalance: any) => {
  return Value.from_bytes(Buffer.from(encodedBalance, "hex"));
};
const decodeBalance = (encodedBalance: any) => {
  const decodedBalance: string = decodeBalanceHelper(encodedBalance).coin().to_str();

  const wholeCoinPart = decodedBalance.slice(0, -COIN_FRACTIONAL_DIGITS_COUNT) || "0";
  const fractionalCoinPart = decodedBalance.slice(-COIN_FRACTIONAL_DIGITS_COUNT);
  return wholeCoinPart + "." + fractionalCoinPart;
};
const isExtensionSupported = (identifier: string) => {
  return supportedWalletsIdentifiers.includes(identifier);
};

const checkExtensionIdentifier = async (extensionIdentifier: string): Promise<void> => {
  let attempt = 0;
  while (!window.cardano || attempt < MAX_ATTEMPTS_TO_OBTAIN_CARDANO) {
    await delay(100);
    attempt++;
  }

  if (!window.cardano) {
    throw new Error(walletMessages.ERRORS.WINDOW_CARDANO_NOT_REACHABLE);
  }
  if (!isExtensionSupported(extensionIdentifier)) {
    throw new Error(extensionIdentifier + walletMessages.ERRORS.WALLET_NOT_SUPPORTED);
  }
  if (!window.cardano[extensionIdentifier.toLowerCase()]) {
    throw new Error(extensionIdentifier + walletMessages.ERRORS.EXTENSION_NOT_INSTALLED);
  }
};

const getExtensionWalletData = async (wallet: any, extensionIdentifier: WalletIdentifiers): Promise<ExtensionWalletData> => {
  const networkId = await wallet.getNetworkId();

  const encodedAddresses = await wallet.getUsedAddresses();
  if (!encodedAddresses?.length) {
    throw new Error(walletMessages.ERRORS.CANNOT_OBTAIN_ADDRESSES);
  }
  const address = decodeAddress(encodedAddresses[0]);
  const encodedStakeKeys = extensionIdentifier === WalletIdentifiers.CARDWALLET ? [await wallet.getRewardAddress()] : await wallet.getRewardAddresses(); //work around CardWallet discrepancy
  const stakeKey = Array.isArray(encodedStakeKeys) && encodedStakeKeys.length ? decodeAddress(encodedStakeKeys[0]) : "";

  return {
    networkId,
    address,
    stakeKey,
    walletExtensionIdentifier: extensionIdentifier,
  };
};
const encodeString = (msg: string) => {
  return Buffer.from(msg, "ascii").toString("hex");
};
const signCardanoMessage = async (extensionIdentifier: string, address: string, message: string, stakeKey: string): Promise<{ signature: string; key: string }> => {
  await checkExtensionIdentifier(extensionIdentifier);
  const encodedMessage = encodeString(message);
  const wallet = await window.cardano[extensionIdentifier.toLowerCase()].enable();

  const encodedStakeKeys = extensionIdentifier === WalletIdentifiers.CARDWALLET ? [await wallet.getRewardAddress()] : await wallet.getRewardAddresses(); //work around cardwallet

  const connectedStakeKey = Array.isArray(encodedStakeKeys) && encodedStakeKeys.length ? decodeAddress(encodedStakeKeys[0]) : "";
  if (stakeKey !== connectedStakeKey) {
    //TODO: maybe remove this check
    throw new Error(extensionIdentifier + ": Please switch to the account that market as CURRENT!");
  }
  const currentAddresses = await wallet.getUsedAddresses();
  const res = await wallet.signData(currentAddresses[0], encodedMessage);
  const { signature, key } = res;

  return { signature, key };
};

export const connectCardanoWalletAndGetExtensionWalletData = async (extensionIdentifier: WalletIdentifiers): Promise<ExtensionWalletData> => {
  await checkExtensionIdentifier(extensionIdentifier);
  const wallet = await window.cardano[extensionIdentifier.toLowerCase()].enable();
  const extensionWalletData = await getExtensionWalletData(wallet, extensionIdentifier);
  return extensionWalletData;
};

export const getCardanoAccountDataWithSignature = async (extensionWalletData: ExtensionWalletData, messageFields: SignatureValidationFields): Promise<UnchangingWalletData> => {
  const messageToSign = `${messageFields.domain} wants you to sign in with your Cardano account:\n${messageFields.from}\n\n${messageFields.info}\n\nURI: ${messageFields.protocol + messageFields.domain}\nVersion: ${messageFields.version}\nChain ID: ${extensionWalletData.networkId}\nNonce: ${messageFields.nonce}\nIssued At: ${messageFields.date}`;
  const signatureAndKey = await signCardanoMessage(extensionWalletData.walletExtensionIdentifier, extensionWalletData.address, messageToSign, extensionWalletData.stakeKey);

  const unchangingWalletData: UnchangingWalletData = {
    id: undefined,
    address: extensionWalletData.address,
    signature: signatureAndKey.signature, //signature of some messeage which user have to sign.
    key: signatureAndKey.key, //comes with signature on message sign only in cardano blockchain
    walletExtensionIdentifier: extensionWalletData.walletExtensionIdentifier,
    stakeKey: extensionWalletData.stakeKey,
    chainId: extensionWalletData.networkId,
  };
  return unchangingWalletData;
};
const isCardanoWalletsEqual = ({ address1, stakeKey1 }: any, { address2, stakeKey2 }: any) => {
  if (address1 === address2 || (stakeKey1 && stakeKey1 === stakeKey2)) {
    return true;
  } else {
    return false;
  }
};
export const getCardanoWalletBalance = async (extensionIdentifier: WalletIdentifiers, { address, stakeKey }: any) => {
  await checkExtensionIdentifier(extensionIdentifier);
  const wallet = await window.cardano[extensionIdentifier.toLowerCase()].enable();
  const { address: addressFromExtension, stakeKey: stakeKeyFromExtension } = await getExtensionWalletData(wallet, extensionIdentifier);
  if (isCardanoWalletsEqual({ address, stakeKey }, { addressFromExtension, stakeKeyFromExtension })) {
    const encodedBalance = await wallet.getBalance();

    return decodeBalance(encodedBalance);
  }
  return undefined;
};
