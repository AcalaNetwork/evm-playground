import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { Box, Container, NavHeader } from '../../components';
import { Setting } from '../setting';
import { Upload } from './Upload';
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

const ContentContainer = styled(Box)`
  margin-top: 32px;
  padding: 20px 24px 24px 24px;
  flex: 1;
`;

export const Deploy = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <NavHeader title={t('Deploy Contract')} />
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
