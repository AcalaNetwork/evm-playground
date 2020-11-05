// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Abi } from '@polkadot/api-contract';
import { api } from '@canvas-ui/react-api';

import getAddressMeta from './getAddressMeta';

export default function getContractAbi (address: string | null): Abi | null {
  if (!address) {
    return null;
  }

  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract?.abi;

    abi = new Abi(data, api.registry.getChainProperties());
  } catch (error) {
    // invalid address, maybe
  }

  return abi || null;
}
