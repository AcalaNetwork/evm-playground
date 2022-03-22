import { Box, BoxProps, Flex, Grid } from 'components/layout';
import { Link } from 'components/link';
import styled from '@emotion/styled/macro';
import { ReactComponent as GithubIcon } from 'assets/icons/github.svg';
import { css } from '@emotion/react/macro';
import { useLocation } from 'react-router-dom';

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
  color: ${({ theme }) => theme.colors.font.nav};

  ${(props) =>
    props.variant === 'isActive' &&
    css`
      color: ${props.theme.colors.font.navActive};
      text-shadow: 0px 0px 2px ${props.theme.colors.font.navActive};
    `}
`;

export const PageNav = ({ ...rest }: BoxProps) => {
  const { pathname } = useLocation();

  const navConfig = [
    {
      name: 'Contracts',
      path: '/'
    },
    {
      name: 'Accounts',
      path: '/accounts'
    }
  ];

  return (
    <PageNavContainer {...rest}>
      <Grid
        css={css`
          grid-template-columns: repeat(${navConfig.length}, auto);
          grid-gap: 80px;
        `}
      >
        {navConfig.map((config) => {
          return (
            <NavItem key={config.path} to={config.path} variant={pathname === config.path ? 'isActive' : ''}>
              {config.name}
            </NavItem>
          );
        })}
      </Grid>
      <Flex
        css={css`
          margin-left: auto;
        `}
      >
        <Link variant="icon" isExternal={true} to="https://github.com/AcalaNetwork/evm-playground">
          <GithubIcon />
        </Link>
      </Flex>
    </PageNavContainer>
  );
};
