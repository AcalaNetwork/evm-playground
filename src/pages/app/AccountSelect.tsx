import { SelectButton } from 'components/buttons';
import { FormControl, FormLabel } from 'components/form';
import { useAccountList, useActiveAccount } from 'state/account/hooks';
import { useEnv } from 'state/application/hooks';
import { ENVIRONMENT } from 'state/application/slice';

export const AccountSelect = () => {
  const account: any = useActiveAccount();
  const [env] = useEnv();
  const accounts = useAccountList();

  return (
    <FormControl>
      <FormLabel>{'account'}</FormLabel>
      <SelectButton
        isDisabled={!accounts.length || accounts.length === 1 || env === ENVIRONMENT.Metamask}
        variant={account ? 'selected' : undefined}
      >
        {account?.evmAddress || account?.substrateAddress || 'Select an account'}
      </SelectButton>
    </FormControl>
  );
};
