import { Box, BoxProps, Flex, Grid } from '../../components';
import styled from '@emotion/styled';
import { GithubIcon } from '../../assets/icons';
import { css } from '@emotion/react';

const PageNavContainer = styled(Box)`
  margin-left: 120px;
  margin-top: 1px;
  font-size: 16px;
  display: flex;
  width: 100%;
  align-items: center;
`;

const NavItem = styled(Box)`
  margin-left: 16px;
`;

export const PageNav = ({ ...rest }: BoxProps) => {
  return (
    <PageNavContainer {...rest}>
      <Grid
        css={css`
          grid-template-columns: repeat(2, auto);
          grid-gap: 80px;
        `}
      >
        <NavItem>Contracts</NavItem>
        <NavItem>Run</NavItem>
      </Grid>
      <Flex
        css={css`
          margin-left: auto;
        `}
      >
        <GithubIcon />
      </Flex>
    </PageNavContainer>
  );
};
