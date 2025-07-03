// import { completeInflightFlowAndGetTokensFromAmplify, refreshCognitoTokens } from "@/utils/cognito/cognitoUtils";
import { State, Context } from "./store";
import { COREKIT_STATUS } from "@web3auth/mpc-core-kit";
import { UserWalletsInBlockchain } from "./modules/wallet/walletModule";
import { getWalletsByBlockchainIdentifierExtensionIdentifier } from "./modules/wallet/walletModuleFunctions";
import { BlockchainIdentifiers, WalletIdentifiers } from "@/data/wallet/walletServiceConstants";

/* initializeState */
// export async function loginToWeb3AuthWithRaceConditionGuard(context: Context, watch: any, web3AuthStatus: string) {
//   if (web3AuthStatus !== COREKIT_STATUS.LOGGED_IN) {
//     // const { idToken } = await refreshCognitoTokens(); //TODO: get from localstorage
//     const { idToken } = await completeInflightFlowAndGetTokensFromAmplify();

//     let isCallCompletedOnce = false;
//     if (context.state.web3auth.coreKitStatus) {
//       context.dispatch("web3auth/loginWithIdToken", idToken);
//       isCallCompletedOnce = true;
//     }
//     const unwatch = watch(
//       (state: State) => state.web3auth.coreKitStatus,
//       async (newCoreKitStatus: COREKIT_STATUS | null) => {
//         //solve race condition between web3auth initialization and id token acception from cognito
//         if (newCoreKitStatus && !isCallCompletedOnce) {
//           context.dispatch("web3auth/loginWithIdToken", idToken);
//           isCallCompletedOnce = true;
//           unwatch();
//         }
//       }
//     );
//   }
// }
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
