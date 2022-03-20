import { FixedNumber } from '@ethersproject/bignumber';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { isFunction } from '@polkadot/util';
import { useCall } from 'hooks/useCall';
import { useIsMountedRef } from 'hooks/useIsMountedRef';
import { useEffect, useMemo, useState } from 'react';
import { useActiveAddress } from 'state/account/hooks';
import { useCurrency, useCurrencyPrice } from 'state/application/hooks';
import { useApiReady } from './useApiReady';

export const usePaymentInfo = (extrinsic?: SubmittableExtrinsic | null) => {
  const api = useApiReady();
  const activeAddress = useActiveAddress();
  const nativeToken = useCurrency('ACA');
  const acaPrice = useCurrencyPrice('ACA');

  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const balances = useCall<DeriveBalancesAll>(!!activeAddress && api?.derive.balances?.all, [activeAddress]);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    activeAddress &&
      api &&
      extrinsic &&
      isFunction(extrinsic.paymentInfo) &&
      isFunction(api.rpc.payment?.queryInfo) &&
      setTimeout((): void => {
        try {
          extrinsic
            .paymentInfo(activeAddress)
            .then((info) => mountedRef.current && setDispatchInfo(info))
            .catch(console.error);
        } catch (error) {
          console.error(error);
        }
      }, 0);
  }, [api, activeAddress, extrinsic, mountedRef]);

  return useMemo(() => {
    if (!api || !dispatchInfo || !extrinsic || !nativeToken?.decimals || !activeAddress || !acaPrice) {
      return null;
    }

    const isFeeError =
      api.consts.balances &&
      !api.tx.balances?.transfer.is(extrinsic) &&
      balances?.accountId.eq(activeAddress) &&
      (balances.availableBalance.lte(dispatchInfo.partialFee) ||
        balances.freeBalance.sub(dispatchInfo.partialFee).lte(api.consts.balances.existentialDeposit));

    const fee = FixedNumber.fromBytes(dispatchInfo.partialFee.toHex(), nativeToken?.decimals);

    const feeUSD = fee.toFormat('fixed').mulUnsafe(acaPrice?.toFormat('fixed'));

    return {
      isFeeError,
      fee,
      feeUSD
    };
  }, [balances, dispatchInfo, extrinsic, nativeToken?.decimals, activeAddress, acaPrice, api]);
};
