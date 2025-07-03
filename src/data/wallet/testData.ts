import { BlockchainIdentifiers } from "./walletServiceConstants";

export const walletsFromBackend = {
  currentWalletId: 101,
  userWallets: [
    {
      blockchainIdentifier: BlockchainIdentifiers.EVM,
      wallets: [
        // {
        //   id: 101,
        //   address: "123",
        //   signature: "456",
        //   key: undefined,
        //   walletExtensionIdentifier: "metamask",
        //   stakeKey: undefined,
        // },
        // {
        //   id: 102,
        //   address: "0x0aed0190e4a1f4cea97d3c9837705861a9a59234",
        //   signature:
        //     "0x9993c5043915ef5c12a1ba9ea9f837a235d7d3bb265068e2bd6626bf5795ebe417fdb77d4d705106088c710d87f8164e529d9be9751a506d614bae619488bdf11c",
        //   key: undefined,
        //   walletExtensionIdentifier: "metamask",
        //   stakeKey: undefined,
        // },
        // {
        //   id: 103,
        //   address: "124",
        //   signature: "457",
        //   key: undefined,
        //   walletExtensionIdentifier: "metamask",
        //   stakeKey: undefined,
        // },
      ],
    },
    {
      blockchainIdentifier: "cardano",
      wallets: [
        // {
        //   id: 201,
        //   address:
        //     "addr_test1qzh6pdsjhu8nyujfnratuh65yn65epmulg73uf9m3lg00a62yhucacd2ngnesyar4paq0ydf6emkdzkg309hr7s8ltwshu4w8q",
        //   signature:
        //     "845846a201276761646472657373583900afa0b612bf0f32724998fabe5f5424f54c877cfa3d1e24bb8fd0f7f74a25f98ee1aa9a279813a3a87a0791a9d677668ac88bcb71fa07fadda166686173686564f44c74657374206d6573736167655840e6966441bc4e4f99fa182eb474f7c45c3b7199dd61e6a7704dffbf7474dd27fa35ff6334d0dff31f6366ac3268c8c07f182067030d51c1e3770d3fc99cd0c90f",
        //   key: "a4010103272006215820baa1a4e49b7c2d23e9f3a6505ef9b8cb64f993eca356cfb2daa54f7fbfaabf56",
        //   walletExtensionIdentifier: "nami",
        //   stakeKey:
        //     "stake_test1up9zt7vwux4f5fuczw36s7s8jx5avamx3tyghjm3lgrl4hgz3vxq5",
        // },
      ],
    },
  ],
};
