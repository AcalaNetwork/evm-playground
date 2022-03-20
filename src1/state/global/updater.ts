import { useEffect } from 'react';
import { currentEnv, useAppSelector } from '..';

export function Updater(): null {
  const ethereum = useAppSelector((state) => state.global.ethereum);
  const env = useAppSelector(currentEnv);


  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts: string[]) => {});
    }
  }, [ethereum]);

  return null;
}
