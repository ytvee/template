export enum BlockchainIdentifiers {
  EVM = "EVM",
  CARDANO = "CARDANO",
}
export type BlockchainIdentifier = keyof typeof BlockchainIdentifiers;
export enum WalletIdentifiers {
  METAMASK = "METAMASK",
  WALLETCONNECT = "WALLETCONNECT",
  WEB3AUTH = "WEB3AUTH",
  NAMI = "NAMI",
  ETERNL = "ETERNL",
  GEROWALLET = "GEROWALLET",
  FLINT = "FLINT",
  CARDWALLET = "CARDWALLET",
  YOROI = "YOROI",
}
export type WalletIdentifier = keyof typeof WalletIdentifiers;

export const blockchainWallets = [
  //to disable blockchain or wallet support comment it.
  {
    identifier: BlockchainIdentifiers.EVM,
    name: "EVM",
    logo: require("@/assets/icons/blockchainwalleticons/EthereumIcon.svg"),
    coinDesignation: "Ξ",
    wallets: [
      {
        name: "Metamask",
        identifier: WalletIdentifiers.METAMASK,
        logo: require("@/assets/icons/blockchainwalleticons/MetamaskIcon.svg"),
        site: "https://metamask.io/",
      },
      {
        name: "Wallet Connect",
        identifier: WalletIdentifiers.WALLETCONNECT,
        logo: require("@/assets/icons/blockchainwalleticons/WalletConnectIcon.svg"),
        site: "https://walletconnect.com",
      },
      {
        name: "Web3Auth Wallet",
        identifier: WalletIdentifiers.WEB3AUTH,
        logo: require("@/assets/icons/blockchainwalleticons/Web3AuthIcon.svg"),
        site: "https://web3auth.io",
        hideFromConnectionModal: true,
      },
    ],
  },
  {
    identifier: BlockchainIdentifiers.CARDANO,
    name: "Cardano",
    logo: require("@/assets/icons/blockchainwalleticons/CardanoIcon.svg"),
    coinDesignation: "₳",
    wallets: [
      {
        name: "Nami",
        identifier: WalletIdentifiers.NAMI,
        logo: require("@/assets/icons/blockchainwalleticons/NamiIcon.svg"),
        site: "https://namiwallet.io/",
      },
      {
        name: "Eternl",
        identifier: WalletIdentifiers.ETERNL,
        logo: require("@/assets/icons/blockchainwalleticons/EternlIcon.svg"),
        site: "https://eternl.io/",
      },
      {
        name: "Gero Wallet",
        identifier: WalletIdentifiers.GEROWALLET,
        logo: require("@/assets/icons/blockchainwalleticons/GeroWalletIcon.svg"),
        site: "https://gerowallet.io/",
      },
      {
        name: "Flint",
        identifier: WalletIdentifiers.FLINT,
        logo: require("@/assets/icons/blockchainwalleticons/FlintIcon.svg"),
        site: "https://flint-wallet.com/",
      },
      // {
      //     name: 'CardWallet',
      //     identifier: WalletIdentifiers.CARDWALLET,
      //     // logo: "not used in project",
      //     site: 'https://cwallet.finance'
      // },
      // {
      //     name: 'Yoroi',
      //     identifier: WalletIdentifiers.YOROI,
      //     // logo: Yoroi,
      //     site: 'https://yoroi-wallet.com'
      // },
    ],
  },
];
