import { Box, BoxProps } from '../layout';
import styled from '@emotion/styled/macro';

const ContractContainer = styled(Box)`
  border-radius: 20px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.13);
  color: var(--colors-font-card);
`;

export const Contract = () => {
  return <ContractContainer>哈哈哈</ContractContainer>;
};
