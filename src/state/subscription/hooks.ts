import { FixedNumber } from '@ethersproject/bignumber';
import { useApiReady } from 'hooks/useApiReady';
import { useCall } from 'hooks/useCall';
import { useEffect, useMemo } from 'react';
import { combineLatest, map } from 'rxjs';
import store from 'state';
import { useCurrency, useCurrencyPrice } from 'state/application/hooks';
import { bestBlockNumberSelector, selectCurrency } from 'state/application/selectors';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { minFixedNumber } from 'utils/number';
import { parseCurrency } from 'utils/token';
import { forceToCurrencyName } from 'wallet/core';
import { subscriptionsSelector } from './selectors';
import { setSubscriptions, SubscriptionDetail } from './slice';

export const useSubscriptionList = (): SubscriptionDetail[] | undefined => {
  const api = useApiReady();
  const bestBlockNumber = useAppSelector(bestBlockNumberSelector);
  const subscriptions = useAppSelector(subscriptionsSelector);
  const ADAO = useCurrency('ADAO');
  const aDAOPrice = useCurrencyPrice('ADAO');
  const dispatch = useAppDispatch();

  const data = useCall<any[]>(api?.query.aquaDao.subscriptions.entries);

  useEffect(() => {
    if (data && ADAO?.decimals && api) {
      const ids: any[] = (data as any)?.map((item: any) => {
        return item[0].args[0];
      });

      if (!ids) return;

      const sub = combineLatest(
        ids?.map((id) => {
          return api.rx.query.aquaDao.subscriptions(id).pipe(
            map((result) => {
              return [id, result];
            })
          );
        })
      ).subscribe((result) => {
        const data = result
          .map((item) => {
            const subscribeId = item[0].toNumber();
            const result = (item[1] as any).unwrap() as any;
            const token = forceToCurrencyName(result.currencyId);
            const { currencyId } = parseCurrency(token);

            const state = store.getState();
            const decimals = selectCurrency(state, currencyId)?.decimals;

            return {
              subscribeId: subscribeId,
              currencyId: currencyId,
              amount: FixedNumber.fromBytes(result.amount.toHex(), ADAO?.decimals),
              vestingPeriod: result.vestingPeriod.toNumber() as number,
              minAmount: FixedNumber.fromBytes(result.minAmount.toHex(), decimals),
              minRatio: FixedNumber.fromBytes(result.minRatio.toHex()),
              discount: {
                max: FixedNumber.fromBytes(result.discount.max.toHex()),
                incOnIdle: FixedNumber.fromBytes(result.discount.incOnIdle.toHex()),
                decPerUnit: FixedNumber.fromBytes(result.discount.decPerUnit.toHex())
              },
              state: {
                totalSold: FixedNumber.fromBytes(result.state.totalSold.toHex(), ADAO.decimals),
                lastSoldAt: result.state.lastSoldAt.toNumber() as number,
                lastDiscount: FixedNumber.fromBytes(result.state.lastDiscount.toHex())
              }
            };
          })
          .sort((a, b) => a.subscribeId - b.subscribeId);

        dispatch(setSubscriptions(data));
      });

      return () => sub.unsubscribe();
    }
  }, [data, dispatch, ADAO?.decimals, api]);

  return useMemo(() => {
    if (!subscriptions || !aDAOPrice || !bestBlockNumber) return;

    return subscriptions?.map((result) => {
      // idle_block = last_sold_at - now
      const idleBlocks = bestBlockNumber - result.state.lastSoldAt;

      // const discountInc =  inc_on_idle * idle_blocks
      const discountInc = result.discount.incOnIdle.mulUnsafe(FixedNumber.from(idleBlocks));

      // const discountDec = dec_per_unit * total_sold
      const discountDec = result.discount.decPerUnit.mulUnsafe(result.state.totalSold.toFormat('fixed'));

      // price_discount = min(max_discount, last_discount + discount_inc - discount_dec)
      const priceDiscount = minFixedNumber(
        result.discount.max,
        result.state.lastDiscount.addUnsafe(discountInc).subUnsafe(discountDec)
      );

      return {
        ...result,
        priceDiscount,
        subscriptionPrice: aDAOPrice.mulUnsafe(FixedNumber.from(1).subUnsafe(priceDiscount))
      };
    });
  }, [subscriptions, aDAOPrice, bestBlockNumber]);
};

export const useSubscriptionDetail = (id?: number | string): SubscriptionDetail | undefined => {
  const list = useSubscriptionList();

  return useMemo(() => {
    if (!id) return;
    return list?.find((item) => item.subscribeId === Number(id));
  }, [id, list]);
};
