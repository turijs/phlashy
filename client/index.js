import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import App from './components/App';
import reducer from './reducers';
import rootSaga from './sagas';
import handlePersistence from './persistence';
import history from './history';
import { login, skipRehydration } from './actions';

// styles
import './sass/base.scss';

// init Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// redux devTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const preloadedState = window.PRELOADED_STATE || {};
delete window.PRELOADED_STATE;

const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(rootSaga);

handlePersistence(store);


// =================================================

ReactDOM.render((
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
),
  document.getElementById('root')
);
