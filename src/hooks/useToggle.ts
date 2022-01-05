import { useCallback, useEffect, useState } from 'react';
import { useIsMountedRef } from './useIsMountedRef';

export function useToggle(
  defaultValue = false,
  onToggle?: (isActive: boolean) => void
): [boolean, () => void, (value: boolean) => void] {
  const mountedRef = useIsMountedRef();
  const [isActive, setActive] = useState(defaultValue);

  const _toggleActive = useCallback((): void => {
    mountedRef.current && setActive((isActive) => !isActive);
  }, [mountedRef]);

  const _setActive = useCallback(
    (isActive: boolean): void => {
      mountedRef.current && setActive(isActive);
    },
    [mountedRef]
  );

  useEffect(() => onToggle && onToggle(isActive), [isActive, onToggle]);

  return [isActive, _toggleActive, _setActive];
}
