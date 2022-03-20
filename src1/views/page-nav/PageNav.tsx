import { Box, BoxProps, Flex, Grid, Link } from '../../components';
import styled from '@emotion/styled';
import { GithubIcon } from '../../assets/icons';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation();

  const navConfig = [
    {
      name: t('Contracts'),
      path: '/'
    },
    {
      name: t('Accounts'),
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
            <NavItem key={config.path} href={config.path} variant={router.asPath === config.path ? 'isActive' : ''}>
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
        <Link variant="icon" isExternal={true} href="https://github.com/AcalaNetwork/evm-playground">
          <GithubIcon />
        </Link>
      </Flex>
    </PageNavContainer>
  );
};
