import styled from '@emotion/styled/macro';
import { FormControl, FormLabel } from 'components/form';
import { Box } from 'components/layout';

const UploadInput = styled(Box)`
  border: 2px solid var(--colors-borderColor2);
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
`;

export const Upload = () => {
  return (
    <FormControl>
      <FormLabel>{'Contract abi'}</FormLabel>
      <UploadInput>{'Click to select or drag & drop to upload file.'}</UploadInput>
    </FormControl>
  );
};
