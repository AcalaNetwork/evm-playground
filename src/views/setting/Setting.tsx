import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Box, BaseInput, BaseSelect, LinkButton, NavHeader, FormControl, FormLabel } from '../../components';

const Container = styled(Box)`
  ${FormControl} {
    margin-top: 20px;
  }
`;

enum ENVIRONMENT {
  Metamask = 'Metamask',
  PolkadotExtension = 'Polkadot Extension'
}

export const Setting = () => {
  const { t } = useTranslation();
  const [env, setEnv] = useState(ENVIRONMENT.Metamask);

  return (
    <Container>
      <FormControl>
        <FormLabel>{t('environment')}</FormLabel>
        <BaseSelect value={env} onChange={(event) => setEnv(event.target.value as ENVIRONMENT)}>
          <option value={ENVIRONMENT.Metamask}>{t(ENVIRONMENT.Metamask)}</option>
          <option value={ENVIRONMENT.PolkadotExtension}>{t(ENVIRONMENT.PolkadotExtension)}</option>
        </BaseSelect>
      </FormControl>
      {env === ENVIRONMENT.PolkadotExtension && (
        <FormControl>
          <FormLabel>{t('endpoint')}</FormLabel>
          <BaseInput placeholder="custom endpoint" />
        </FormControl>
      )}
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
