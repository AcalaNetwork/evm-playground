import styled from '@emotion/styled/macro';
import { BaseButton } from './BaseButton';

export const MainButton = styled(BaseButton)`
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.font.button};
  background: ${({ theme }) => theme.colors.mainButton};
  padding: 8px 16px;
`;
