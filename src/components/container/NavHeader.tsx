import styled from '@emotion/styled';
import React from 'react';
import { Box, Grid } from '../layout';
import { css } from '@emotion/react';

export const NavHeaderTitle = styled(Box)`
  font-size: 32px;
  color: var(--colors-font-title);
`;

export const NavHeaderContent = styled(Box)`
  height: 112px;
  max-width: var(--sizes-container);
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
`;

export const NavHeaderWrapper = styled(Box)`
  border-bottom: 1px solid var(--colors-bodrerColor2);
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
