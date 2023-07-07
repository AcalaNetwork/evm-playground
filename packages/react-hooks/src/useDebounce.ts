// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';

import useIsMountedRef from './useIsMountedRef';

const DEFAULT_DELAY = 250;

// Debounces inputs
export default function useDebounce <T> (value: T, delay?: number): T {
  const mountedRef = useIsMountedRef();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect((): () => void => {
    const handler = setTimeout(() => {
      mountedRef.current && setDebouncedValue(value);
    }, delay || DEFAULT_DELAY);

    // each time it renders, it clears
    return (): void => {
      clearTimeout(handler);
    };
  }, [delay, value, mountedRef]);

  return debouncedValue;
}