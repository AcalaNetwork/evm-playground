import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { BaseSelect, Flex, Box, FormControl, FormLabel, MainButton, SelectButton, SelectModal } from '../../components';
import { useToggle } from '../../hooks';
import { currentEnv, useAppDispatch, useAppSelector, ENVIRONMENT, setEnv } from '../../state';

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

export const EnvSelect = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isOpen, , setOpen] = useToggle();

  const env = useAppSelector(currentEnv);

  return (
    <FormControl>
      <FormLabel>{t('environment')}</FormLabel>
      <SelectButton onClick={() => setOpen(true)} variant="selected">
        {env || t('Select an environment')}
      </SelectButton>
      <SelectModal title={t('Select an environment')} isOpen={isOpen} onClose={() => setOpen(false)}>
        <EnvWrapper>
          <OptionCard>
            <Flex
              css={css`
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Box>{t('Metamask')}</Box>
              <MainButton>{t('Connect')}</MainButton>
            </Flex>
          </OptionCard>
          <OptionCard></OptionCard>
          <OptionCard></OptionCard>
        </EnvWrapper>
      </SelectModal>
    </FormControl>
  );
};
