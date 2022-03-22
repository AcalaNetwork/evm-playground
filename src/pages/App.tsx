import styled from '@emotion/styled/macro';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { Route, Routes } from 'react-router-dom';
import Custom404 from './404';
import { Footer } from './app/Footer';
import { Header } from './app/Header';
import { Deploy } from './deploy/Deploy';
import { Home } from './home/Home';
import { Modals } from './Modals';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  min-height: 100%;
`;

const BodyWrapper = styled.div`
  width: 100%;
  flex: 1;
`;

function App() {
  return (
    <ErrorBoundary>
      <AppWrapper>
        <Header />
        <BodyWrapper>
          <Modals />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deploy" element={<Deploy />} />
            <Route path="*" element={<Custom404 />} />
          </Routes>
        </BodyWrapper>
        <Footer />
      </AppWrapper>
    </ErrorBoundary>
  );
}

export default App;
