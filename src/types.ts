export enum TokenSymbol {
  ACA = 'ACA',
  DOT = 'DOT',
  AUSD = 'AUSD',
  LCDOT = 'LCDOT',
  ADAO = 'ADAO',
  SDAO = 'SDAO',
  LDOT = 'LDOT'
}

export const TokenList: {
  name: string;
  symbol: TokenSymbol;
  mark: string;
}[] = [
  {
    name: 'ACA',
    symbol: 'ACA' as TokenSymbol,
    mark: 'ACA'
  },
  {
    name: 'DOT',
    symbol: 'DOT' as TokenSymbol,
    mark: 'DOT'
  },
  {
    name: 'aUSD',
    symbol: 'AUSD' as TokenSymbol,
    mark: 'AUSD'
  },
  {
    name: 'Liquid DOT',
    symbol: 'LDOT' as TokenSymbol,
    mark: 'LDOT'
  },
  {
    name: 'LCDOT',
    symbol: 'LCDOT' as TokenSymbol,
    mark: 'lc://13'
  },
  {
    name: 'aDAO',
    symbol: 'ADAO' as TokenSymbol,
    mark: 'aDAO'
  },
  {
    name: 'sDAO',
    symbol: 'SDAO' as TokenSymbol,
    mark: 'sDAO'
  }
];

export type LPToken = `LP:${keyof typeof TokenSymbol}-${keyof typeof TokenSymbol}`;

export type CurrencyId =
  | keyof typeof TokenSymbol
  | LPToken
  | TokenSymbol
  | [keyof typeof TokenSymbol, keyof typeof TokenSymbol];
