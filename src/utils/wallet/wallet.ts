import { blockchainWallets, WalletIdentifiers } from "@/data/wallet/walletServiceConstants";

export const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export const getBlockchainInformationByBlockchainIdentifier = (blockchainIdentifier: string) => {
  const blockchain = blockchainWallets.find((blockchain) => blockchain.identifier === blockchainIdentifier);
  return {
    name: blockchain?.name,
    logo: blockchain?.logo,
    coinDesignation: blockchain?.coinDesignation,
  };
};
export const getExtensionInformationByWalletIdentifier = (walletIdentifier: WalletIdentifiers) => {
  for (const blockchain of blockchainWallets) {
    const extensionInformation = blockchain.wallets.find((wallet) => wallet.identifier === walletIdentifier);
    if (extensionInformation) {
      return extensionInformation;
    }
  }
  throw new Error(`wallet extension identifier ${walletIdentifier} not found in blockchain!`);
};
export const displayNumberValue = (numberValue: any, designation: string) => {
  if (numberValue === undefined) return "undefined";
  if (numberValue === null) return "null";
  return numberValue + " " + designation;
};
