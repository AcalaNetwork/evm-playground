// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from "./types";

import EventEmitter from "eventemitter3";
import { nanoid } from "nanoid";
import store from "store";

const KEY_CODE = "code:";

function newId(): string {
  return nanoid(6);
}

class Store extends EventEmitter {
  private allCode: Record<string, Code> = {};

  private hashToId: Record<string, string> = {};

  public get hasCode(): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  public isHashSaved(codeHash: string): boolean {
    return !!this.hashToId[codeHash];
  }

  public isReady = false;

  public getAllCode(): Code[] {
    return Object.values(this.allCode);
  }

  public getCode(id: string): Code | null {
    return this.allCode[id] || null;
  }

  // public getCodeFromHash (codeHash: string): CodeStored {
  //   return this.allCode[shortId(codeHash)];
  // }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async saveCode(code: Pick<Code, never>, anId?: string): Promise<string> {
    const id = anId || newId();
    const existing = anId ? this.getCode(anId) : null;

    const json = {
      ...existing,
      ...code,
      genesisHash: "0x0000000000000000000000000000000000000000",
      id,
    };

    store.set(`${KEY_CODE}${id || newId()}`, json);

    this.addCode(id, json as Code);

    return id;
  }

  public forgetCode(id: string): void {
    store.remove(`${KEY_CODE}${id}`);

    this.removeCode(id);
  }

  // public forgetCodeByHash (codeHash: string): void {
  //   const id = shortId(codeHash);

  //   store.remove(`${KEY_CODE}${id}`);
  //   this.removeCode(id);
  // }

  public async loadAll(): Promise<void> {
    try {
      // await api.isReady;

      const genesisHash = "0x0000000000000000000000000000000000000000";

      store.each((json: Code, key: string): void => {
        if (json && json.genesisHash !== genesisHash) {
          return;
        }

        if (key.startsWith(KEY_CODE)) {
          const id = key.split(":")[1];

          this.addCode(id, json);
          this.hashToId[json.codeHash] = id;
        }
      });
    } catch (error) {
      console.error("Unable to load code", error);
    }
  }

  private addCode(id: string, json: Code): void {
    try {
      this.hashToId[json.codeHash] = id;
      this.allCode[id] = json;

      this.emit("new-code");
    } catch (error) {
      console.error(error);
    }
  }

  private removeCode(id: string): void {
    try {
      const { codeHash } = this.allCode[id];

      delete this.hashToId[codeHash];
      delete this.allCode[id];
      this.emit("removed-code");
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
