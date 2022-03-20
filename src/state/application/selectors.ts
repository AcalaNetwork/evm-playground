import { FixedNumber } from '@ethersproject/bignumber';
import { createSelector } from 'reselect';
import { AppState } from 'state';
import { CurrencyId } from 'types';
import { toFixedNumber } from 'utils/number';
import { parseCurrency } from 'utils/token';
import { getCurrencyObject } from 'wallet/core';

export const languageSelector = (state: AppState) => state.application.language;

export const walletSelector = (state: AppState) => state.application.wallet;

export const currenciesSelector = (state: AppState) => state.application.currencies;

export const marketSelector = (state: AppState) => state.application.marketPrice;

export const oracleSelector = (state: AppState) => state.application.oraclePrice;

export const dexSelector = (state: AppState) => state.application.dexPrice;

export const adaoPriceSelector = (state: AppState) => state.application.adaoPrice;

export const bestBlockNumberSelector = (state: AppState) => state.application.bestBlockNumber;

export const selectCurrency = createSelector([currenciesSelector, (state, id?: CurrencyId) => id], (currencies, id) => {
  if (!Object.keys(currencies).length) return;

  if (!id) return;

  try {
    const { currencyId, name, tokens, isLpToken } = parseCurrency(id);
    const currency = currencies[currencyId];

    if (!currency) return;

    return {
      currencyId,
      name,
      tokens,
      isLpToken,
      decimals: currency.decimals,
      ed: toFixedNumber(currency.ed, currency.decimals, currency.decimals),
      currencyType: getCurrencyObject(currency.name)
    };
  } catch {
    return;
  }
});
const ausdPrice = FixedNumber.from(1);

export const selectCurrencyPrice = createSelector(
  [marketSelector, oracleSelector, dexSelector, adaoPriceSelector, (state, id?: CurrencyId) => id],
  (market, oracle, dex, adaoPrice, id) => {
    if (!id) return;
    try {
      const { currencyId } = parseCurrency(id);

      if (currencyId === 'AUSD') {
        return ausdPrice;
      }

      if (currencyId === 'ACA') {
        return ausdPrice;
      }

      if (currencyId === 'ADAO') {
        return adaoPrice || undefined;
      }

      return market[currencyId] || oracle[currencyId] || dex[currencyId] || undefined;
    } catch {
      return;
    }
  }
);
