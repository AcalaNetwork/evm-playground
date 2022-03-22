import { Flex as CFlex } from '@chakra-ui/layout';
import styled from '@emotion/styled/macro';

export const Flex = CFlex;

export const FlexCenter = styled(CFlex)`
  align-items: center;
`;

export const FlexInline = styled(FlexCenter)`
  display: inline-flex;
`;
