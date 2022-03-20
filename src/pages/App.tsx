import styled from '@emotion/styled/macro';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { Footer, FooterWrapper } from 'components/Footer';
import { Header, HeaderWrapper } from 'components/Header';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from './dashboard';
import { Modals } from './Modals';
import { Subscribe } from './subscribe';
import { Subscription } from './subscribe/Subscription';
import { Stake } from './stake';
import { Staking } from './stake/Staking';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  min-height: 100%;
`;

const BodyWrapper = styled.div`
  width: 100%;
  flex: 1;
  background: #ededf4;
`;

function App() {
  return (
    <ErrorBoundary>
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Modals />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/subscribe/:id" element={<Subscription />} />
            <Route path="/stake" element={<Stake />} />
            <Route path="/stake/:id" element={<Staking />} />
            <Route path="*" element={<Navigate to={{ pathname: '/dashboard' }} />} />
          </Routes>
        </BodyWrapper>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </AppWrapper>
    </ErrorBoundary>
  );
}

export default App;
