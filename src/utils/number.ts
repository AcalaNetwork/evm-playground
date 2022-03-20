import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { FixedPointNumber } from 'wallet/core';

export const toFixedNumber = (number: FixedPointNumber, decimals?: number, format?: number) => {
  const inner = number._getInner();

  return FixedNumber.fromValue(
    BigNumber.from(inner.integerValue().toString()),
    decimals ?? number.getPrecision(),
    format
  );
};

export const toDecimals = (number: FixedNumber, decimals: number) => {
  if (number.format.decimals === decimals) return number;
  if (number.format.decimals < decimals) return number.toFormat(`fixed128x${decimals}`);

  const isNegative = number.isNegative();

  const value =
    BigNumber.from(
      number.mulUnsafe(FixedNumber.fromString(isNegative ? '-1' : '1', number.format.decimals)).toHexString()
    ).toBigInt() /
    10n ** (BigInt(number.format.decimals) - BigInt(decimals));

  return FixedNumber.fromBytes(BigNumber.from(value).toHexString(), decimals).mulUnsafe(
    FixedNumber.fromString(isNegative ? '-1' : '1', decimals)
  );
};

export const round = (number: FixedNumber, round: number) => {
  const decimals = number.format.decimals;
  const value = toDecimals(number, round);

  return value.toFormat(`fixed128x${decimals}`);
};

export const minFixedNumber = (left: FixedNumber, right: FixedNumber) => {
  return left.subUnsafe(right).isNegative() ? left : right;
};
