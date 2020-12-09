// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from "@canvas-ui/apps/types";
import { VoidFn } from "@canvas-ui/react-util/types";
import { AnyJson } from "@polkadot/types/types";
import { FileState } from "./types";

import { useCallback, useEffect, useState } from "react";
import { Abi } from "@polkadot/api-contract";
import store from "@canvas-ui/apps/store";
import { useApi } from "@canvas-ui/react-hooks";
import { u8aToString } from "@polkadot/util";

import { useTranslation } from "./translate";

interface UseAbi {
  abi: {
    bytecode: any;
    evm: any;
    abi: any;
  } | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  onChangeAbi: (_: FileState) => void;
  onRemoveAbi: VoidFn;
}

type State = [Abi | null, boolean, boolean];

export default function useAbi(source: any | null = null, isRequired = false): UseAbi {
  const { api } = useApi();
  const { t } = useTranslation();

  const initialState: State = source
    ? [source.abi, !!source?.abi, !isRequired || !!source.bytecode]
    : [null, false, false];

  const [[abi, isAbiSupplied, isAbiValid], setAbi] = useState<State>(initialState);

  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect((): void => {
    if (!!source?.abi) {
      setAbi([source.abi, !!source.abi, !isRequired || !!source.bytecode]);
    }
  }, [abi, api.registry, source, isRequired]);

  const onChangeAbi = useCallback(
    ({ data }: FileState): void => {
      const json = u8aToString(data);

      try {
        const source = JSON.parse(json) as any;

        if (!source.evm || !source.bytecode) {
          throw new Error(t<string>("The abi you are using should contain evm and bytecode."));
        }

        setAbi([source.abi, true, true]);
        setError([false, null]);
        source?.id && store.saveCode({ abi: source }, source.id);
      } catch (error) {
        console.error(error);

        setAbi([null, false, false]);
        setError([true, error]);
      }
    },
    [api.registry, source, t]
  );

  const onRemoveAbi = useCallback((): void => {
    setAbi([null, false, false]);
    setError([false, null]);

    source?.id && store.saveCode({ abi: null }, source?.id);
  }, [source]);

  return {
    abi,
    errorText,
    isAbiError,
    isAbiSupplied,
    isAbiValid,
    onChangeAbi,
    onRemoveAbi
  };
}
