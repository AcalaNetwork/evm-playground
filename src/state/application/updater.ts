import { FixedNumber } from '@ethersproject/bignumber';
import { useApiReady } from 'hooks/useApiReady';
import { useCall } from 'hooks/useCall';
import { useEffect, useMemo } from 'react';
import { combineLatest, map } from 'rxjs';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { toFixedNumber } from 'utils/number';
import { parseCurrency } from 'utils/token';
import { FixedPointNumber, Token } from 'wallet/core';
import { Wallet } from 'wallet/wallet';
import { PriceProviderType } from 'wallet/wallet/wallet/price-provider/types';
import { useWallet } from './hooks';
import { currenciesSelector } from './selectors';
import { initWallet, setADAOPrice, setBestBlockNumber, setCurrencies, setDex, setMarket, setOracle } from './slice';

export function MarketPriceUpdater() {
  const dispatch = useAppDispatch();

  const wallet = useWallet();
  const currencies = useAppSelector(currenciesSelector);
  const currencyList = useMemo(() => {
    return Object.values(currencies);
  }, [currencies]);

  useEffect(() => {
    if (wallet) {
      wallet.getTokens().then((result) => {
        const data = Object.values(result)
          .map((token) => {
            try {
              const { currencyId } = parseCurrency(token);

              return [currencyId, token] as [string, Token];
            } catch (error) {
              return [token.symbol, token] as [string, Token];
            }
          })
          .reduce((result, current) => {
            result[current[0]] = current[1];
            return result;
          }, {} as Record<string, Token>);

        dispatch(setCurrencies(data));
      });
    }
  }, [wallet, dispatch]);

  useEffect(() => {
    if (currencyList.length && wallet) {
      const getPrice = (type: PriceProviderType, action: any) =>
        combineLatest([
          ...currencyList
            .filter((item) => type === PriceProviderType.DEX && ['ADAO', 'LCDOT'].includes(item.name))
            .map((token) => {
              return wallet.subscribePrice(token, type).pipe(
                map((price) => {
                  return [token, price] as [Token, FixedPointNumber];
                })
              );
            })
        ]).subscribe((data) => {
          const dispatchFunc = (token: any, price: any) => {
            if (!price.isZero()) {
              return dispatch(
                action({
                  token,
                  price
                })
              );
            }
          };

          for (const item of data) {
            if (!item[1].isNaN() && item[1].isFinaite()) {
              try {
                const { currencyId } = parseCurrency(item[0]);

                dispatchFunc(currencyId, toFixedNumber(item[1]));
              } catch (error) {
                dispatchFunc(item[0].symbol, toFixedNumber(item[1]));
              }
            }
          }
        });

      const subscribeMarket = getPrice(PriceProviderType.MARKET, setMarket);
      const subscribeOracle = getPrice(PriceProviderType.ORACLE, setOracle);
      const subscribeDex = getPrice(PriceProviderType.DEX, setDex);

      return () => {
        subscribeMarket.unsubscribe();
        subscribeOracle.unsubscribe();
        subscribeDex.unsubscribe();
      };
    }
  }, [currencyList, wallet, dispatch]);

  return null;
}

export function DexOracleUpdater() {
  const api = useApiReady();

  // const dexTradePairsEntries = useCall(api?.query.dexOracle.averagePrices.entries);

  // useEffect(() => {
  //   if (!api) return;

  //   const tradePairs: any[] = (dexTradePairsEntries as any)?.map((item: any) => {
  //     return item[0].args[0];
  //   });

  //   if (!tradePairs) return;

  //   const sub = combineLatest(
  //     tradePairs?.map((pairs) => {
  //       return api.rx.query.dexOracle.averagePrices(pairs).pipe(
  //         map((result) => {
  //           return [pairs, result];
  //         })
  //       );
  //     })
  //   ).subscribe((result) => {
  //     const data = result.map((item) => {
  //       const [token1, token2] = item[0].map((token: any) => forceToCurrencyName(token));
  //       const { currencyId } = parseCurrency([token1, token2]);
  //       const result = (item[1] as any).unwrap() as any;
  //       const [price1, price2] = [FixedNumber.fromBytes(result[0].toHex()), FixedNumber.fromBytes(result[1].toHex())];

  //       console.log(currencyId, price1, price2);
  //     });
  //   });

  //   return () => sub.unsubscribe();
  // }, [dexTradePairsEntries, api]);

  const dispatch = useAppDispatch();
  const params = useMemo(() => {
    return [
      {
        Token: 'AUSD'
      },
      {
        Token: 'ADAO'
      }
    ];
  }, []);

  const data = useCall(api?.query.dexOracle.averagePrices, [params]);

  useEffect(() => {
    if (!data || (data as any).isEmpty) return;
    const result = (data as any).unwrap() as any;
    const [, price2] = [FixedNumber.fromBytes(result[0].toHex()), FixedNumber.fromBytes(result[1].toHex())];

    dispatch(setADAOPrice(price2));
  }, [data, dispatch]);
  
  return null;
}

export function Updater(): null {
  const dispatch = useAppDispatch();
  const api = useApiReady();

  useEffect(() => {
    if (api) {
      const wallet = new Wallet(api);

      wallet.isReady.then(() => {
        dispatch(initWallet(wallet));
      });
    }
  }, [dispatch, api]);

  useEffect(() => {
    if (api) {
      api.derive.chain.bestNumber((blockNumber) => {
        dispatch(setBestBlockNumber(blockNumber.toNumber()));
      });
    }
  }, [api, dispatch]);

  return null;
}
