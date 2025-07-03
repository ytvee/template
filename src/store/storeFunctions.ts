import { State, Context } from "./store";
import { COREKIT_STATUS } from "@web3auth/mpc-core-kit";
import { UserWalletsInBlockchain } from "./modules/wallet/walletModule";
import { getWalletsByBlockchainIdentifierExtensionIdentifier } from "./modules/wallet/walletModuleFunctions";
import { BlockchainIdentifiers, WalletIdentifiers } from "@/data/wallet/walletServiceConstants";

/* initializeState */
/**
 * The purpose of the function is to prohibit activating web3auth if the user does not yet have a web3auth wallet, but already has a metamask wallet connected to the portal backend
 * @param userWallets all wallets owned by user
 * @returns if Web3Auth activation is required
 */
export function computeIsNecessaryToEnableWeb3Auth(userWallets: UserWalletsInBlockchain[]) {
  const metamaskWallets = getWalletsByBlockchainIdentifierExtensionIdentifier(userWallets, BlockchainIdentifiers.EVM, WalletIdentifiers.METAMASK);
  const web3AuthWallets = getWalletsByBlockchainIdentifierExtensionIdentifier(userWallets, BlockchainIdentifiers.EVM, WalletIdentifiers.WEB3AUTH);

  const hasMetamaskWallet = metamaskWallets.length;
  const hasWeb3AuthWallet = web3AuthWallets.length;
  return hasWeb3AuthWallet || !hasMetamaskWallet;
}
/* /initializeState */
