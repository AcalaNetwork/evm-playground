// Copyright 2017-2020 @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-api/types';
import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@canvas-ui/react-hooks';

import FormatBalance from './FormatBalance';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function BalanceFree ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={allBalances?.freeBalance}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BalanceFree);
