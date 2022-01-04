import { Select, SelectProps } from '@chakra-ui/react';
import styled from '@emotion/styled';

export type BaseSelectProps = SelectProps;

export const BaseSelect = styled(Select)`
  background: var(--colors-inputBg);
  color: var(--colors-font-input);
  border-color: var(--colors-borderColor1);
  border-radius: 10px;
  height: 32px;
  font-size: 14px;
  padding: 0px 12px;
  line-height: 32px;

  width: 100%;
  min-width: 0px;
  outline: transparent solid 2px;
  outline-offset: 2px;
  position: relative;
  appearance: none;
  padding-bottom: 1px;
  border-width: 1px;
  border-style: solid;

  &:focus {
    border-color: var(--colors-borderFocus);
    box-shadow: var(--colors-borderFocus) 0px 0px 0px 1px;
  }

  & + .chakra-select__icon-wrapper {
    width: 1.5rem;
    height: 100%;
    right: 0.5rem;
    position: absolute;
    color: currentcolor;
    font-size: 1.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
  }
`;
