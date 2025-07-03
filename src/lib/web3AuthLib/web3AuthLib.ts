import { Context } from "@/store/modules/wallet/walletModule";
import { SignatureValidationFields, UnchangingWalletData } from "../common/common";
import { WalletIdentifiers } from "@/data/wallet/walletServiceConstants";

function getMessageByMessageFields(messageFields: SignatureValidationFields): string {
  return `${messageFields.domain} wants you to sign in with your Ethereum account:\n${messageFields.from}\n\n${messageFields.info}\n\nURI: ${messageFields.protocol + messageFields.domain}\nVersion: ${messageFields.version}\nChain ID: ${messageFields.chainId}\nNonce: ${messageFields.nonce}\nIssued At: ${messageFields.date}`;
}
export async function getWeb3AuthAccountDataWithSignature(context: Context, address: string, messageFields: SignatureValidationFields): Promise<UnchangingWalletData> {
  // const { chainId: chainId } = await provider.getNetwork();

  // const signature = await getMessageSignature(signer, { ...messageFields, chainId }, options);
  const chainId = await context.dispatch("web3auth/getChainId", undefined, { root: true });
  messageFields = {
    ...messageFields,
    chainId,
  };
  const messageToSign = getMessageByMessageFields(messageFields);
  const signature = await context.dispatch("web3auth/signMessage", messageToSign, { root: true });

  const unchangingWalletData: UnchangingWalletData = {
    address: address,
    signature: signature,
    walletExtensionIdentifier: WalletIdentifiers.WEB3AUTH,
    chainId,
  };
  return unchangingWalletData;
}
