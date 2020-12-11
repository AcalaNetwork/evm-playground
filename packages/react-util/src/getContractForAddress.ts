// Copyright 2017-2020 @canvas-ui/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getContractAbi } from "@canvas-ui/react-util";
import { ApiPromise } from "@polkadot/api";
import { ethers } from "ethers";
import { StringOrNull } from "./types";

export default function getContractForAddress(api: ApiPromise, address: StringOrNull): ethers.Contract | null {
  if (!address) {
    return null;
  } else {
    const abi = getContractAbi(address);

    return abi ? new ethers.Contract(address, abi as any) : null;
  }
}
