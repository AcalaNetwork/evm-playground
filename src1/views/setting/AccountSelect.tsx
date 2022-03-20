import { useTranslation } from 'next-i18next';
import { FormControl, FormLabel, SelectButton } from '../../components';
import { currentEnv, ENVIRONMENT, selectedAccount, useAppDispatch, useAppSelector } from '../../state';

export const AccountSelect = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const acc = useAppSelector(selectedAccount);
  const env = useAppSelector(currentEnv);
  const accounts = useAppSelector((state) => state.global.accounts);
  const isOpen = useAppSelector((state) => state.global.accModalOpen);

  return (
    <FormControl>
      <FormLabel>{t('account')}</FormLabel>
      <SelectButton
        isDisabled={!accounts.length || accounts.length === 1 || env === ENVIRONMENT.Metamask}
        variant={acc ? 'selected' : undefined}
      >
        {acc?.evmAddress || acc?.substrateAddress || 'Select an account'}
      </SelectButton>
    </FormControl>
  );
};
