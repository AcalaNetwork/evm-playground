import { Button, ButtonProps } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

export type BaseButtonProps = ButtonProps;

export const BaseButton = styled(Button)`
  border: 0;
  cursor: pointer;
  margin: 0;
  display: inline-flex;
  outline: 0;
  padding: 0;
  position: relative;
  align-items: center;
  user-select: none;
  border-radius: 0;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;

  font-weight: 500;
  font-size: 14px;
  color: var(--colors-font-button);

  :hover {
    filter: brightness(95%) saturate(90%);
  }
  :hover[disabled] {
    filter: brightness(100%) saturate(100%);
  }

  :focus {
    box-shadow: inherit;
  }

  &[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

BaseButton.defaultProps = {
  colorScheme: 'none'
};
