import styled from '@emotion/styled/macro';
import { LinkButton } from 'components/buttons';
import { Container, NavHeader } from 'components/container';
import { Box } from 'components/layout';
import { Setting } from 'pages/app/Setting';

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
  return (
    <Box>
      <NavHeader title={'Contracts'}>
        <LinkButton to="/deploy">Deploy Contract</LinkButton>
        <LinkButton to="/load">Load Contract</LinkButton>
      </NavHeader>
      <MainContainer>
        <SettingContainer>
          <Setting />
        </SettingContainer>
      </MainContainer>
    </Box>
  );
};
