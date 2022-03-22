import styled from '@emotion/styled/macro';
import React from 'react';
import { Box, Grid } from '../layout';
import { css } from '@emotion/react/macro';
import { Container } from './Container';

export const NavHeaderTitle = styled(Box)`
  font-size: 32px;
  color: ${({ theme }) => theme.colors.font.title};
`;

export const NavHeaderContent = styled(Container)`
  height: 112px;
  display: flex;
  align-items: center;
`;

export const NavHeaderWrapper = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor2};
`;

export const NavHeader = ({
  title,
  children,
  ...props
}: React.PropsWithChildren<{
  title?: React.ReactNode;
}>) => {
  return (
    <NavHeaderWrapper {...props}>
      <NavHeaderContent>
        <NavHeaderTitle>{title}</NavHeaderTitle>
        <Grid
          css={css`
            margin-left: auto;
            grid-template-columns: repeat(2, auto);
            grid-gap: 32px;
          `}
        >
          {children}
        </Grid>
      </NavHeaderContent>
    </NavHeaderWrapper>
  );
};
