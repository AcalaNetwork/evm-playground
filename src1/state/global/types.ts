export enum ENVIRONMENT {
  Metamask = 'Metamask',
  PolkadotExtension = 'Polkadot Extension'
}

export type Account = {
  evmAddress?: string;
  substrateAddress?: string;
};
