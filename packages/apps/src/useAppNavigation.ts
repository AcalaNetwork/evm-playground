// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppNavigation } from "./types";

import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export default function useAppNavigation(): AppNavigation {
  const history = useHistory();

  const navigator = useCallback(
    (path: string): (() => void) => {
      return function (): void {
        history.push(path);
      };
    },
    [history]
  );

  return {
    bindAccount: navigator("/binding"),
    deploy: navigator("/deploy"),
    newEvmAccount: navigator("/evmAccount"),
    deployNew: useCallback(
      (id: string, constructorIndex = 0): (() => void) => {
        return navigator(`/deploy/new/${id}/${constructorIndex}`);
      },
      [navigator]
    ),
    deploySuccess: useCallback(
      (address: string): (() => void) => {
        return navigator(`/deploy/success/${address}`);
      },
      [navigator]
    ),
    bindSuccess: useCallback(
      (address: string): (() => void) => {
        return navigator(`/evmAccount/success/${address}`);
      },
      [navigator]
    ),
    execute: navigator("/execute"),
    executeAdd: navigator("/execute/add"),
    executeCall: useCallback(
      (address: string, messageIndex = 0): (() => void) => {
        return navigator(`/execute/${address}/${messageIndex}`);
      },
      [navigator]
    ),
    upload: navigator("/upload"),
    uploadAdd: navigator("/upload/add"),
    uploadSuccess: useCallback(
      (id: string): (() => void) => {
        return navigator(`/deploy`);
      },
      [navigator]
    ),
  };
}
