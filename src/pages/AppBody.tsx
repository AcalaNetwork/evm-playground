import styled from '@emotion/styled/macro';
import { Box } from 'components/layout';

export const AppBody = styled(Box)`
  max-width: ${(props) => props.theme.sizes.body};
  margin: 0 auto;
  padding: 40px 24px 80px;
  position: relative;
`;
