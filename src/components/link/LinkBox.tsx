import styled from '@emotion/styled/macro';
import { Box } from '../layout';
import { LinkOverlay } from './LinkOverlay';

export const LinkBox = styled(Box)`
  position: relative;

  a[href]:not(${LinkOverlay}),
  abbr[title] {
    position: relative;
    z-index: 1;
  }
`;
