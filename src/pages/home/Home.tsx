import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { Box, Flex, LinkButton, NavHeader, Container } from '../../components';
import { Setting } from '../setting';

const MainContainer = styled(Container)`
  display: flex;
`;

const SettingContainer = styled(Box)`
  width: 400px;
  border-right: 1px solid var(--colors-borderColor2);
  margin-top: 32px;
  padding-right: 24px;
  padding-bottom: 24px;
`;

export const Home = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <NavHeader title={t('Contracts')}>
        <LinkButton href="/deploy">Deploy Contract</LinkButton>
        <LinkButton href="/load">Load Contract</LinkButton>
      </NavHeader>
      <MainContainer>
        <SettingContainer>
          <Setting />
        </SettingContainer>
      </MainContainer>
    </Box>
  );
};
