const walletMessages = {
  ERRORS: {
    UNKNOWN_BLOCKCHAIN_IDENTIFIER: "Unknown blockchain identifier!",
    UNKNOWN_WALLET_INEDTIFIER: "Unknown wallet identifier!",
    EXTENSION_NOT_INSTALLED: " wallet extension is not installed!",
    WALLET_NOT_SUPPORTED: " wallet is not supported!",
    METAMASK_WALLET_REQUEST_PERMISSIONS_FAILED_NO_PERMISSION: "Metamask wallet request permissions failed: eth_accounts permission not presented in responce!",
    METAMASK_WALLET_REQUEST_PERMISSIONS_FAILED: "Metamask wallet request permissions failed!",
    WINDOW_CARDANO_NOT_REACHABLE: "window.cardano object is not reachable!",
    CANNOT_OBTAIN_ADDRESSES: "Can not obtain used addresses because of your wallet have no AGIX",
    WEB3AUTH_BALANCE_NO_BLOCKCHAIN: "Tried to update web3auth wallet balance but there are no blockchain in which web3auth expected",
    WEB3AUTH_BALANCE_NO_WALLET: "Tried to update web3auth wallet balance but web3auth wallet not received from backend or current web3auth account differs from web3auth account form backend",
  },
  INFO: {
    WAITING_CONNECT_METAMASK_PROVIDER: "Metamask provider is not connected! Trying to check it again...",
    METAMASK_PROVIDER_CONNECTED: "Metamask provider is connected",
    WALLET_ALREADY_CONNECTED: (extensionIdentifier: string, walletDecodedAddress: string) => `You tried to connect wallet of ${extensionIdentifier} extension with address ${walletDecodedAddress} but it is already connected to your account. Action aborted.`,
  },
};

export default walletMessages;
