import { AnyApi } from 'wallet/core';

export function getNativeTokenName(api: AnyApi): string {
  return api.registry.chainTokens[0].toString();
}
