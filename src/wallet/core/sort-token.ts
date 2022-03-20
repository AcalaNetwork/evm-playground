import {
  getCurrencyTypeByName,
  getForeignAssetIdFromName,
  getLiquidCrowdloanIdFromName,
  getStableAssetPoolIdFromName,
  isBasicToken,
  isDexShareName,
  isForeignAssetName,
  isLiquidCrowdloanName,
  isStableAssetName,
  unzipDexShareName
} from './converter';
import { TokenType } from './types';

const TOKEN_TYPE_WEIGHTS = {
  [TokenType.BASIC]: 9,
  [TokenType.DEX_SHARE]: 8,
  [TokenType.ERC20]: 7,
  [TokenType.STABLE_ASSET_POOL_TOKEN]: 6,
  [TokenType.LIQUID_CROWDLOAN]: 5,
  [TokenType.FOREIGN_ASSET]: 4
};

export function getTokenTypeWeight(name: string): number {
  return 1000 * (TOKEN_TYPE_WEIGHTS[getCurrencyTypeByName(name)] || 0);
}

const TOKEN_SORT: Record<string, number> = {
  ACA: 0,
  AUSD: 1,
  DOT: 2,
  LDOT: 3,
  ADAO: 4,
  SDAO: 5,
  RENBTC: 20,
  CASH: 21,
  KAR: 128,
  KUSD: 129,
  KSM: 130,
  LKSM: 131,
  BNC: 168,
  VSKSM: 169
};

export function sortTokenByName(a: string, b: string): number {
  let weightA = 0;
  let weightB = 0;

  weightA += getTokenTypeWeight(a);
  weightB += getTokenTypeWeight(b);

  if (weightA !== weightB) {
    return weightB - weightA;
  }

  if (isBasicToken(a) && isBasicToken(b)) {
    return TOKEN_SORT[a] - TOKEN_SORT[b];
  }

  if (isStableAssetName(a) && isStableAssetName(b)) {
    return getStableAssetPoolIdFromName(a) - getStableAssetPoolIdFromName(b);
  }

  if (isForeignAssetName(a) && isForeignAssetName(b)) {
    return getForeignAssetIdFromName(a) - getForeignAssetIdFromName(b);
  }

  if (isLiquidCrowdloanName(a) && isLiquidCrowdloanName(b)) {
    return getLiquidCrowdloanIdFromName(a) - getLiquidCrowdloanIdFromName(b);
  }

  if (isDexShareName(a) && isDexShareName(b)) {
    const [a0, a1] = unzipDexShareName(a);
    const [b0, b1] = unzipDexShareName(b);

    const [result0, result1] = [sortTokenByName(a0, a1), sortTokenByName(b0, b1)];

    if (a0 === b0) return result1;

    return result0;
  }

  return 0;
}
