import type BN from 'bn.js';
import { BigNumber, FixedNumber } from 'ethers';
import numbro from 'numbro';

export const convertBN = () => {};

export const formatDollarAmount = (num: number | FixedNumber | undefined, { digits = 2, ...options } = {}) => {
  if (FixedNumber.isFixedNumber(num)) {
    num = num.round(digits);
  }

  if (num === 0) return '$0.00';

  if (!num) return '-';

  if (num < 0.001 && digits <= 3) {
    return '<$0.001';
  }

  return numbro(num).formatCurrency({
    mantissa: num > 1000 ? 2 : digits,
    thousandSeparated: true,
    abbreviations: {
      million: 'M',
      billion: 'B'
    },
    ...options
  });
};

export const formatAmount = (num: number | FixedNumber | undefined, { digits = 2, ...options } = {}) => {
  if (FixedNumber.isFixedNumber(num)) {
    num = num.round(digits);
  }

  if (num === 0) return '0';

  if (!num) return '-';

  if (num < 0.001) {
    return '<0.001';
  }

  return numbro(num).format({
    average: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B'
    },
    ...options
  });
};

export const bnToFixed = (value: BN, decimals = 12) => {
  return FixedNumber.fromValue(BigNumber.from(value.toString()), decimals);
};
