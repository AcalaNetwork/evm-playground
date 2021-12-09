import { Box, BoxProps, Flex, Grid, Link } from '../../components';
import styled from '@emotion/styled';
import { GithubIcon } from '../../assets/icons';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';

const PageNavContainer = styled(Box)`
  margin-left: 120px;
  margin-top: 2px;
  font-size: 16px;
  display: flex;
  width: 100%;
  align-items: center;
`;

const NavItem = styled(Link)`
  margin-left: 16px;
  transition: color 0.2s ease;
  line-height: 40px;
  padding-left: 2px;
  padding-right: 2px;
  color: var(--colors-font-nav);

  ${(props) =>
    props.variant === 'isActive' &&
    css`
      color: var(--colors-font-navActive);
      text-shadow: 0px 0px 2px var(--colors-font-navActive);
    `}
`;

export const PageNav = ({ ...rest }: BoxProps) => {
  const router = useRouter();

  return (
    <PageNavContainer {...rest}>
      <Grid
        css={css`
          grid-template-columns: repeat(3, auto);
          grid-gap: 80px;
        `}
      >
        <NavItem href="/" variant={router.asPath === '/' ? 'isActive' : ''}>
          Contracts
        </NavItem>
        <NavItem href="/run" variant={router.asPath === '/run' ? 'isActive' : ''}>
          Run
        </NavItem>
        <NavItem href="/accounts" variant={router.asPath === '/accounts' ? 'isActive' : ''}>
          Accounts
        </NavItem>
      </Grid>
      <Flex
        css={css`
          margin-left: auto;
        `}
      >
        <Link variant="icon" isExternal={true} href="https://github.com/AcalaNetwork/evm-playground">
          <GithubIcon />
        </Link>
      </Flex>
    </PageNavContainer>
  );
};
