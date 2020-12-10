// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from "@canvas-ui/apps/store";
import { useApi } from "@canvas-ui/react-hooks";
import { VoidFn } from "@canvas-ui/react-util/types";
import { u8aToString } from "@polkadot/util";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "./translate";
import { FileState } from "./types";

interface UseAbi {
  abi: any[] | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  bytecode: string | null;
  onChangeAbi: (_: FileState) => void;
  onRemoveAbi: VoidFn;
}

type State = [any | null, boolean, boolean, string | null];

export default function useAbi(source: any | null = null, isRequired = false): UseAbi {
  const { api } = useApi();
  const { t } = useTranslation();

  const initialState: State = source
    ? [source.abi, !!source?.abi, !isRequired || !!source.bytecode, source.bytecode]
    : [null, false, false, null];

  const [[abi, isAbiSupplied, isAbiValid, bytecode], setAbi] = useState<State>(initialState);

  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect((): void => {
    if (!!source?.abi) {
      setAbi([source.abi, !!source.abi, !isRequired || !!source.bytecode, source.bytecode]);
    }
  }, [abi, api.registry, source, isRequired]);

  const onChangeAbi = useCallback(
    ({ data }: FileState): void => {
      const json = u8aToString(data);

      try {
        const source = JSON.parse(json) as any;

        if (!source.bytecode) {
          throw new Error(t<string>("The abi you are using should contain evm and bytecode."));
        }

        setAbi([source.abi, true, true, source.bytecode]);
        setError([false, null]);
        source?.id && store.saveCode({ abi: source }, source.id);
      } catch (error) {
        console.error(error);

        setAbi([null, false, false, source.bytecode]);
        setError([true, error]);
      }
    },
    [api.registry, source, t]
  );

  const onRemoveAbi = useCallback((): void => {
    setAbi([null, false, false, null]);
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
    onRemoveAbi,
    bytecode,
  };
}
