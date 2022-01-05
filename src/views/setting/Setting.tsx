import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { BaseInput, BaseSelect, Box, FormControl, FormLabel } from '../../components';
import { EnvSelect } from './EnvSelect';
const Container = styled(Box)`
  ${FormControl} {
    margin-top: 20px;
  }
`;

export const Setting = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <EnvSelect />
      <FormControl>
        <FormLabel>{t('account')}</FormLabel>
        <BaseSelect></BaseSelect>
      </FormControl>
      <FormControl>
        <FormLabel>{t('gas limit')}</FormLabel>
        <BaseInput placeholder="custom endpoint" />
      </FormControl>
      <FormControl>
        <FormLabel>{t('storage limit')}</FormLabel>
        <BaseInput placeholder="custom endpoint" />
      </FormControl>
      <FormControl>
        <FormLabel>{t('value')}</FormLabel>
        <BaseInput placeholder="custom endpoint" />
      </FormControl>
    </Container>
  );
};
