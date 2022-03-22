import { css } from '@emotion/react/macro';
import styled from '@emotion/styled/macro';
import { BaseButtonProps } from '.';
import { Box } from '../layout';
import { MainButton } from './MainButton';

const StyledSelectButton = styled(MainButton)`
  width: 100%;
  height: 32px;
  border-radius: 8px;
  padding: 0px 12px;
  justify-content: left;

  ${(props) =>
    props.variant === 'selected' &&
    css`
      background: ${props.theme.colors.inputBg};
      color: ${props.theme.colors.font.input};
      border-color: ${props.theme.colors.borderColor1};
    `}
`;

const IconWrapper = styled(Box)`
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
`;

export const SelectButton = ({ children, ...props }: BaseButtonProps) => {
  return (
    <StyledSelectButton {...props}>
      {children}
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          role="presentation"
          className="select__icon"
          focusable="false"
          aria-hidden="true"
          style={{
            width: '1em',
            height: '1em',
            color: 'currentcolor'
          }}
        >
          <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
        </svg>
      </IconWrapper>
    </StyledSelectButton>
  );
};
