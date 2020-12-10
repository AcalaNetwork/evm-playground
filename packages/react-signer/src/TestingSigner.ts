// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from "@polkadot/api";
import { Signer, SignerResult } from "@polkadot/api/types";
import creatTestingPairs from "@polkadot/keyring/testingPairs";
import { Hash } from "@polkadot/types/interfaces";
import type { Registry } from "@polkadot/types/types";
import { SignerPayloadJSON } from "@polkadot/types/types";

let id = 0;

export default class TestingSigner implements Signer {
  pairs: ReturnType<typeof creatTestingPairs>;

  constructor(public registry: Registry) {
    this.pairs = creatTestingPairs();
  }

  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    const account = Object.keys(this.pairs).find((key) => {
      return this.pairs[key].address === payload.address;
    });

    if (!account) throw new Error("should be testing account");

    return new Promise((resolve, reject): void => {
      try {
        const signed = this.registry
          .createType("ExtrinsicPayload", payload, { version: payload.version })
          .sign(this.pairs[account]);
        resolve({ id: ++id, ...signed });
      } catch (error) {
        reject(error);
      }
    });
  }

  public update(id: number, result: Hash | SubmittableResult): void {}
}
