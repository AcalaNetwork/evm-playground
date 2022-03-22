import { css } from '@emotion/react/macro';
import { Box } from 'components/layout';

export default function Custom404() {
  return (
    <Box
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 240px;
      `}
    >
      <Box as="h1">404 | Page Not Found</Box>
    </Box>
  );
}
