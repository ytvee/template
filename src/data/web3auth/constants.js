//=============test data for localhost=====================
// export const GOOGLE_OAUTH2_CLIENT_ID =
//   "581224504399-cblosjo24mofbo1s4if4vnrqiep1usut.apps.googleusercontent.com"; //google-auth-test

// export const WEB3AUTH_CLIENT_ID =
//   "BHP682sgRmxo1zyeM4CU54GYoljCKOc-Ep_fYEl75sjwqWT8kIksbsnAEYxF802IKPVjIXR7n6a4g43OxR0nK9w";
// export const WEB3AUTH_VERIFIER = "jam-galaxy-google-auth-test";

// import { WEB3AUTH_NETWORK } from "@web3auth/mpc-core-kit";
// export const WEB3AUTH_NETWORK_ID = WEB3AUTH_NETWORK.DEVNET; //switch to MAINNET when you go into production

// import { CHAIN_NAMESPACES } from "@web3auth/base";
// export const EVM_CHAIN_CONFIG = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x1", // Please use 0x1 for Mainnet
//   rpcTarget: "https://rpc.ankr.com/eth",
//   displayName: "Ethereum Mainnet",
//   blockExplorer: "https://etherscan.io/",
//   ticker: "ETH",
//   tickerName: "Ethereum",
// };

//=============prod data=====================
// export const GOOGLE_OAUTH2_CLIENT_ID =
//   "246513009319-46l79cuibsbgq46fnvu8b2ito4kifaa3.apps.googleusercontent.com"; //jam-galaxy-prod

// export const WEB3AUTH_CLIENT_ID =
//   "BHP682sgRmxo1zyeM4CU54GYoljCKOc-Ep_fYEl75sjwqWT8kIksbsnAEYxF802IKPVjIXR7n6a4g43OxR0nK9w";
// export const WEB3AUTH_VERIFIER = "jam-galaxy-prod";

// import { WEB3AUTH_NETWORK } from "@web3auth/mpc-core-kit";
// export const WEB3AUTH_NETWORK_ID = WEB3AUTH_NETWORK.DEVNET; //switch to MAINNET when you go into production

// import { CHAIN_NAMESPACES } from "@web3auth/base";
// export const EVM_CHAIN_CONFIG = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x1", // Please use 0x1 for Mainnet
//   rpcTarget: "https://rpc.ankr.com/eth",
//   displayName: "Ethereum Mainnet",
//   blockExplorer: "https://etherscan.io/",
//   ticker: "ETH",
//   tickerName: "Ethereum",
// };

//=============web3auth data for login with cognito=====================
export const GOOGLE_OAUTH2_CLIENT_ID = "581224504399-cblosjo24mofbo1s4if4vnrqiep1usut.apps.googleusercontent.com"; //google-auth-test

export const WEB3AUTH_CLIENT_ID = "BHP682sgRmxo1zyeM4CU54GYoljCKOc-Ep_fYEl75sjwqWT8kIksbsnAEYxF802IKPVjIXR7n6a4g43OxR0nK9w";
export const WEB3AUTH_VERIFIER = "jamgalaxy-cognito-demo";

import { WEB3AUTH_NETWORK } from "@web3auth/mpc-core-kit";
export const WEB3AUTH_NETWORK_ID = WEB3AUTH_NETWORK.DEVNET; //switch to MAINNET when you go into production

import { CHAIN_NAMESPACES } from "@web3auth/base";
export const EVM_CHAIN_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xAA36A7", // hex of 11155111
  // rpcTarget: "https://sepolia.infura.io/v3/98064002908248a0b0d837940d2c647b", // Replace with a reliable Sepolia RPC URL
  rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode, etc., for higher reliability
  displayName: "Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

/*
* mainnet
export const EVM_CHAIN_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  // chainId: "0x1", // Please use 0x1 for Mainnet
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth",
  // displayName: "Ethereum Mainnet",
  displayName: "Sepolia",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};
*/
