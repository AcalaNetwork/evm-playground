import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { BaseInput, Box, FormControl, FormLabel } from '../../components';

const UploadInput = styled(Box)`
  border: 2px solid var(--colors-borderColor2);
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
`;

export const Upload = () => {
  const { t } = useTranslation();

  return (
    <FormControl>
      <FormLabel>{t('Contract abi')}</FormLabel>
      <UploadInput>{t('Click to select or drag & drop to upload file.')}</UploadInput>
    </FormControl>
  );
};
