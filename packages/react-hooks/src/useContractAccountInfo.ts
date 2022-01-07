// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAccountInfo } from "@polkadot/api-derive/types";
import keyring from "@polkadot/ui-keyring";
import { useCallback, useEffect, useState } from "react";
import { AddressIdentity } from "./types";
import useAccounts from "./useAccounts";
import useApi from "./useApi";
import useCall from "./useCall";
import useToggle from "./useToggle";

export default function useAccountInfo(value: string | null, isContract = false): any {
  const { isAccount } = useAccounts();
  const [accountIndex, setAccountIndex] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState<AddressIdentity | undefined>();
  const [isEditingName, toggleIsEditingName] = useToggle();

  const onSaveName = useCallback((): void => {
    if (isEditingName) {
      toggleIsEditingName();
    }

    const meta = { name, whenEdited: Date.now() };

    if (isContract) {
      try {
        if (value) {
          const originalMeta = keyring.getAddress(value)?.meta;

          keyring.saveContract(value, { ...originalMeta, ...meta });
        }
      } catch (error) {
        console.error(error);
      }
    } else if (value) {
      try {
        const pair = keyring.getPair(value);

        pair && keyring.saveAccountMeta(pair, meta);
      } catch (error) {
        const pair = keyring.getAddress(value);

        if (pair) {
          keyring.saveAddress(value, meta);
        } else {
          keyring.saveAddress(value, { genesisHash: "0x0000000000000000000000000000000000000000", ...meta });
        }
      }
    }
  }, [isContract, isEditingName, name, toggleIsEditingName, value]);

  return {
    isEditingName,
    name,
    onSaveName,
    setName,
    toggleIsEditingName
  };
}
