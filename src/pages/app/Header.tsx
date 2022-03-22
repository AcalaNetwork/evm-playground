import styled from '@emotion/styled/macro';
import { PageLogo } from 'assets/page';
import { Box } from 'components/layout';
import { Link } from 'components/link';
import { PageNav } from './PageNav';

const HeaderContainer = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.header};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor1};
`;

const HeaderContent = styled(Box)`
  height: 80px;
  max-width: ${({ theme }) => theme.sizes.container};
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
        <Link variant="icon" to="/">
          <PageLogo height="40px" />
        </Link>
        <PageNav />
      </HeaderContent>
    </HeaderContainer>
  );
};
