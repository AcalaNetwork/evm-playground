import Numeral from 'numeral';

export const formattedNum = (number: any, usd = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0;
  }
  let num = parseFloat(number);

  if (num > 500000000) {
    return (usd ? '$' : '') + Numeral(num.toFixed(0)).format('0.[00]a');
  }

  if (num === 0) {
    return 0;
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001';
  }

  if (num > 1000) {
    return Number(parseFloat(num as any).toFixed(0)).toLocaleString();
  }

  return Number(parseFloat(num as any).toFixed(5)).toLocaleString();
};
