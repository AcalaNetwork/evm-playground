import styled from '@emotion/styled/macro';
import { Box } from 'components/layout';
import { Container, NavHeader } from 'components/container';
import { Setting } from 'pages/app/Setting';
import { Upload } from './Upload';

const MainContainer = styled(Container)`
  display: flex;
`;

const SettingContainer = styled(Box)`
  width: 400px;
  border-right: 1px solid ${({ theme }) => theme.colors.borderColor2};
  margin-top: 32px;
  padding-right: 24px;
  padding-bottom: 24px;
`;

const ContentContainer = styled(Box)`
  margin-top: 32px;
  padding: 20px 24px 24px 24px;
  flex: 1;
`;

export const Deploy = () => {
  return (
    <Box>
      <NavHeader title={'Deploy Contract'} />
      <MainContainer>
        <SettingContainer>
          <Setting />
        </SettingContainer>
        <ContentContainer>
          <Upload />
        </ContentContainer>
      </MainContainer>
    </Box>
  );
};
