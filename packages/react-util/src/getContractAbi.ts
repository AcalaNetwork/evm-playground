// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import getAddressMeta from "./getAddressMeta";

export default function getContractAbi(address: string | null): any[] | null {
  if (!address) {
    return null;
  }

  let abi: any[] | undefined;
  const meta = getAddressMeta(address, "contract");

  try {
    const data = meta.contract?.abi;

    abi = JSON.stringify(data) as any;
  } catch (error) {
    // invalid address, maybe
  }

  return abi || null;
}
