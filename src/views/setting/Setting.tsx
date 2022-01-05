import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { BaseInput, BaseSelect, Box, FormControl, FormLabel, SelectButton } from '../../components';
import { selectedAccount, useAppSelector } from '../../state';
import { EnvSelect } from './EnvSelect';
import { AccountSelect } from './AccountSelect';
const Container = styled(Box)`
  ${FormControl} {
    margin-top: 20px;
  }
`;

export const Setting = () => {
  const { t } = useTranslation();
  const acc = useAppSelector(selectedAccount);

  return (
    <Container>
      <EnvSelect />
      <AccountSelect />
      <FormControl>
        <FormLabel>{t('gas limit')}</FormLabel>
        <BaseInput placeholder="custom endpoint" />
      </FormControl>
      <FormControl>
        <FormLabel>{t('storage limit')}</FormLabel>
        <BaseInput placeholder="storage limit" />
      </FormControl>
      <FormControl>
        <FormLabel>{t('value')}</FormLabel>
        <BaseInput placeholder="value" />
      </FormControl>
    </Container>
  );
};
