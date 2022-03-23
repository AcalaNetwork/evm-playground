import { Input, InputProps } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

export type BaseInputProps = InputProps;

export const BaseInput = styled(Input)`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.font.input};
  border-color: ${({ theme }) => theme.colors.borderColor1};
  border-radius: 8px;
  height: 32px;
  font-size: 14px;
  padding: 0px 12px;

  width: 100%;
  min-width: 0px;
  outline: transparent solid 2px;
  outline-offset: 2px;
  position: relative;
  appearance: none;

  border-width: 1px;
  border-style: solid;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: none;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: none;
  }
`;
