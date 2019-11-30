import { routerMiddleware as reactRouterReduxMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore, compose, Dispatch } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { history } from 'config';

import rootReducer, { RootState, ROOT_INITIAL_STATE } from './rootReducer';
import SagaManager, { rootSaga } from './rootSaga';

const routerMiddleware = reactRouterReduxMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

export { RootState, Dispatch };

declare const __DEV__: boolean;

const configStore = () => {
  // STORE CONFIGURATIONS
  const storeEnhancers: any = [];
  const middlewares: any = [routerMiddleware, sagaMiddleware];

  // apply middlewares
  storeEnhancers.push(applyMiddleware(...middlewares));

  // add dev-tools storeEnhancer
  if (__DEV__) {
    const debugEnhancer =
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

    debugEnhancer && storeEnhancers.push(debugEnhancer);
  }

  const store = {
    ...createStore<RootState>(rootReducer, ROOT_INITIAL_STATE, compose(...storeEnhancers)),
    startAbortableSaga: () => SagaManager.startSaga(sagaMiddleware),
  };

  // enable hot reload
  if (__DEV__ && module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(require('./rootReducer').default));

    module.hot.accept('./rootSaga', () => {
      SagaManager.cancelSaga(store);
      require('./rootSaga').default.startSaga(sagaMiddleware); // eslint-disable-line global-require
    });
  }

  return store;
};

const store = configStore();

store.startAbortableSaga();

export default store;
