import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { BaseInput, Box, Flex, FormControl, FormLabel, MainButton, SelectButton, SelectModal } from '../../components';
import {
  currentEnv,
  ENVIRONMENT,
  setAccounts,
  setEnv,
  setEnvModalOpen,
  setEthereum,
  useAppDispatch,
  useAppSelector
} from '../../state';

const OptionCard = styled(Box)`
  background: var(--colors-modalCard);
  color: var(--colors-font-title);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
`;

const EnvWrapper = styled(Box)`
  border-top: 1px solid var(--colors-borderColor2);
  padding: 20px;

  ${OptionCard}:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const CustomEndpointInput = styled(BaseInput)`
  margin-top: 8px;
`;

export const EnvSelect = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const env = useAppSelector(currentEnv);
  const isOpen = useAppSelector((state) => state.global.envModalOpen);

  return (
    <FormControl>
      <FormLabel>{t('environment')}</FormLabel>
      <SelectButton onClick={() => dispatch(setEnvModalOpen(true))} variant={env ? 'selected' : undefined}>
        {env || t('Select an environment')}
      </SelectButton>
      <SelectModal title={t('Select an environment')} isOpen={isOpen} onClose={() => dispatch(setEnvModalOpen(false))}>
        <EnvWrapper>
          <OptionCard>
            <Flex
              css={css`
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Box>{t('Metamask')}</Box>
              <MainButton
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  dispatch(setEnv(ENVIRONMENT.Metamask));
                  const ethereum = (window as any).ethereum;
                  try {
                    if (ethereum) {
                      dispatch(setEthereum(ethereum));
                      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                      if (accounts.length) {
                        dispatch(setAccounts(accounts.map((addr: string) => ({ evmAddress: addr }))));
                        dispatch(setEnvModalOpen(false));
                      }
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {t('Connect')}
              </MainButton>
            </Flex>
          </OptionCard>
          <OptionCard>
            <Flex
              css={css`
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Box>{t('Polkadot Extension(testnet)')}</Box>
              <MainButton
                isLoading={isLoading}
                onClick={() => {
                  dispatch(setEnv(ENVIRONMENT.PolkadotExtension));
                  dispatch(setEnvModalOpen(false));
                }}
              >
                {t('Connect')}
              </MainButton>
            </Flex>
          </OptionCard>
          <OptionCard>
            <Flex
              css={css`
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Box
                css={css`
                  width: 100%;
                  margin-right: 64px;
                `}
              >
                <Box
                  css={css`
                    font-size: 16px;
                  `}
                >
                  {t('Polkadot Extension(custom endpoint)')}
                </Box>
                <CustomEndpointInput placeholder="custom endpoint" />
              </Box>

              <MainButton
                isLoading={isLoading}
                onClick={() => {
                  dispatch(setEnv(ENVIRONMENT.PolkadotExtension));
                  dispatch(setEnvModalOpen(false));
                }}
              >
                {t('Connect')}
              </MainButton>
            </Flex>
          </OptionCard>
        </EnvWrapper>
      </SelectModal>
    </FormControl>
  );
};
