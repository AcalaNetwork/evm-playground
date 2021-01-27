import type { Signer, SignerResult } from "@polkadot/api/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { Registry, SignerPayloadJSON } from "@polkadot/types/types";
import React from "react";

type Options = { key: string; text: React.ReactNode; value: number }[];

const emptyArray: any = [];

let id = 0;

export class TestingSigner implements Signer {
  readonly #keyringPair: KeyringPair;
  readonly #registry: Registry;

  constructor(registry: Registry, keyringPair: KeyringPair) {
    this.#keyringPair = keyringPair;
    this.#registry = registry;
  }

  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve): void => {
      const signed = this.#registry
        .createType("ExtrinsicPayload", payload, { version: payload.version })
        .sign(this.#keyringPair);

      resolve({ id: ++id, ...signed });
    });
  }
}
