import { Box, BoxProps } from '../layout';
import styled from '@emotion/styled';

const ContractContainer = styled(Box)`
  border-radius: 20px;
  background: var(--colors-card);
  color: var(--colors-font-card);
`;

export const Contract = () => {
  return <ContractContainer>哈哈哈</ContractContainer>;
};
