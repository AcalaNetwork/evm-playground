// Copyright 2017-2020 @canvas-ui/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getContractAbi } from "@canvas-ui/react-util";
import { ApiPromise } from "@polkadot/api";
import { ethers } from "ethers";
import { StringOrNull } from "./types";
import { utils } from "ethers";

export default function getContractForAddress(api: ApiPromise, address: StringOrNull): ethers.Contract | null {
  if (!address) {
    return null;
  } else {
    // console.log('呵呵捷克好2', address)
    const contract = Object.keys(localStorage)
      .map(x => x.match(/contract:(0x[0-9a-zA-Z]{40})/)?.[1])
      .filter(x => x)
      .find(x => x?.toLowerCase() === address.toLowerCase()) as any;

    const abi = JSON.parse(localStorage.getItem(`contract:${contract}`) as any)?.meta?.contract?.abi;

    // const abi = getContractAbi(address);
    return abi ? new ethers.Contract(address, abi as any) : null;
  }
}
