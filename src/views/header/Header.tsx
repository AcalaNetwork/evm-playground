import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { PageLogo } from '../../assets/page';
import { Box, Link } from '../../components';
import { PageNav } from '../page-nav';

const HeaderContainer = styled(Box)`
  background-color: var(--colors-header);
  border-bottom: 1px solid var(--colors-bodrerColor1);
`;

const HeaderContent = styled(Box)`
  height: 80px;
  max-width: var(--sizes-container);
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
`;

export const Header = () => {
  return (
    <HeaderContainer as="header">
      <HeaderContent>
        <Link variant="icon" href="/">
          <PageLogo height="40px" />
        </Link>
        <PageNav />
      </HeaderContent>
    </HeaderContainer>
  );
};
