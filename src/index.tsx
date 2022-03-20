import '@acala-network/types/interfaces/types-lookup';
import '@polkadot/api-augment/polkadot';
import { Api } from 'chain-api-provider/Api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import store from './state';
import { ThemeProvider } from './theme';

dayjs.extend(utc);

function Updaters() {
  return null
}

// const endpoints = ['ws://127.0.0.1:9944'];
// const endpoints = ['wss://acala-polkadot.api.onfinality.io/public-ws'];
const endpoints = ['wss://aquadao-testnet.aca-dev.network/'];

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Api endpoints={endpoints}>
        <HashRouter>
          <Updaters />
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </HashRouter>
      </Api>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
