// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer, SignerResult } from "@polkadot/api/types";
import { Injected } from "@polkadot/extension-inject/types";
import { createTestPairs, TestKeyringMap } from "@polkadot/keyring/testingPairs";
import type { Registry } from "@polkadot/types/types";
import { SignerPayloadJSON } from "@polkadot/types/types";
let id = 0;

export default class TestingSigner implements Signer {
  pairs: TestKeyringMap;

  constructor(public registry: Registry, public signer: Injected["signer"]) {
    this.pairs = createTestPairs();
  }

  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    const account = Object.keys(this.pairs).find((key) => {
      return this.pairs[key].address === payload.address;
    });

    if (!account) {
      return (this.signer as any).signPayload(payload) as any;
    } else {
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
  }
}
