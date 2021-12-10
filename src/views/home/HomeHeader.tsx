import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTranslation } from 'next-i18next';
import { Box, MainButton } from '../../components';

const HomeHeaderContainer = styled(Box)`
  border-bottom: 1px solid var(--colors-bodrerColor2);
  /* background: rgba(255, 255, 255, 0.02); */
`;

const HomeHeaderContent = styled(Box)`
  height: 112px;
  max-width: var(--sizes-container);
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
`;

const PageTitle = styled(Box)`
  font-size: 32px;
  color: var(--colors-font-title);
`;

export const HomeHeader = () => {
  const { t } = useTranslation();

  return (
    <HomeHeaderContainer>
      <HomeHeaderContent>
        <PageTitle>{t('Contracts')}</PageTitle>
        <Box
          css={css`
            margin-left: auto;
          `}
        >
          <MainButton>Add Contract</MainButton>
        </Box>
      </HomeHeaderContent>
    </HomeHeaderContainer>
  );
};
