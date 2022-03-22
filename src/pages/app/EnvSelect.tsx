import { css } from '@emotion/react/macro';
import styled from '@emotion/styled/macro';
import { MainButton, SelectButton } from 'components/buttons';
import { FormControl, FormLabel } from 'components/form';
import { BaseInput } from 'components/inputs';
import { Box, Flex } from 'components/layout';
import { SelectModal } from 'components/modal';
import { useState } from 'react';
import { useEnv, useEnvModal } from 'state/application/hooks';
import { ENVIRONMENT } from 'state/application/slice';

const OptionCard = styled(Box)`
  background: ${({ theme }) => theme.colors.modalCard};
  color: ${({ theme }) => theme.colors.font.title};
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
`;

const EnvWrapper = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor2};
  padding: 20px;

  ${OptionCard}:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const CustomEndpointInput = styled(BaseInput)`
  margin-top: 8px;
`;

export const EnvSelect = () => {
  // const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [env, setEnv] = useEnv();
  const [isOpen, toggleEnv] = useEnvModal();

  return (
    <FormControl>
      <FormLabel>{'environment'}</FormLabel>
      <SelectButton onClick={() => toggleEnv()} variant={env ? 'selected' : undefined}>
        {env || 'Select an environment'}
      </SelectButton>
      <SelectModal title={'Select an environment'} isOpen={isOpen} onClose={() => toggleEnv(false)}>
        <EnvWrapper>
          <OptionCard>
            <Flex
              css={css`
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Box>{'Metamask'}</Box>
              <MainButton
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  setEnv(ENVIRONMENT.Metamask);
                  const ethereum = (window as any).ethereum;
                  try {
                    if (ethereum) {
                      // dispatch(setEthereum(ethereum));
                      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                      if (accounts.length) {
                        // dispatch(setAccounts(accounts.map((addr: string) => ({ evmAddress: addr }))));
                        toggleEnv(false);
                      }
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {'Connect'}
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
              <Box>{'Polkadot Extension(testnet)'}</Box>
              <MainButton
                isLoading={isLoading}
                onClick={() => {
                  setEnv(ENVIRONMENT.PolkadotExtension);
                  toggleEnv(false);
                }}
              >
                {'Connect'}
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
                  {'Polkadot Extension(custom endpoint)'}
                </Box>
                <CustomEndpointInput placeholder="custom endpoint" />
              </Box>

              <MainButton
                isLoading={isLoading}
                onClick={() => {
                  setEnv(ENVIRONMENT.PolkadotExtension);
                  toggleEnv(false);
                }}
              >
                {'Connect'}
              </MainButton>
            </Flex>
          </OptionCard>
        </EnvWrapper>
      </SelectModal>
    </FormControl>
  );
};
