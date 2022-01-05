import { Input, InputProps } from '@chakra-ui/react';
import styled from '@emotion/styled';

export type BaseInputProps = InputProps;

export const BaseInput = styled(Input)`
  background: var(--colors-inputBg);
  color: var(--colors-font-input);
  border-color: var(--colors-borderColor1);
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

  &:focus {
    border-color: var(--colors-borderFocus);
    box-shadow: var(--colors-borderFocus) 0px 0px 0px 1px;
  }
`;
