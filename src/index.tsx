import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import styled from 'styled-components';

import { App } from './components/App';
import { history } from 'config';
import store from 'core/store';

const container = document.getElementById('root');

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const ContentWrap = styled.div`
  display: flex;
  flex-grow: 1;
`;

const ComponentWrap = styled.div`
  flex-grow: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 10px 100px 13px;
`;

const renderApp = (Component: any) => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Layout>
          <ContentWrap>
            <ComponentWrap>
              <Component />
            </ComponentWrap>
          </ContentWrap>
        </Layout>
      </ConnectedRouter>
    </Provider>,
    container
  );
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const newApp = require('./components/App').App;
    renderApp(newApp);
  });
}

renderApp(App);
