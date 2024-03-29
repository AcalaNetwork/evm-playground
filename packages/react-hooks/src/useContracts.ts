// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";
import { contracts } from "@polkadot/ui-keyring/observable/contracts";

import useIsMountedRef from "./useIsMountedRef";

interface UseContracts {
  allContracts: string[];
  hasContracts: boolean;
  isContract: (address: string) => boolean;
  isReady: boolean;
}

export default function useContracts(): UseContracts {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseContracts>({
    allContracts: [],
    hasContracts: false,
    isContract: () => false,
    isReady: false,
  });

  useEffect((): (() => void) => {
    const subscription = contracts.subject.subscribe((contracts): void => {
      if (mountedRef.current) {
        const allContracts = contracts ? Object.keys(contracts) : [];

        const hasContracts = allContracts.length !== 0;
        const isContract = (address: string): boolean => allContracts.includes(address);

        setState({ allContracts, hasContracts, isContract, isReady: true });
      }
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  return state;
}
