import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import App from './components/App';
import reducers from './reducers';
import rootSaga from './sagas';

// CSS
import 'font-awesome/css/font-awesome.css';
import './sass/main.scss';

// init history object for router
const history = createHistory();

// init Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  {user: window.USER},
  applyMiddleware(
    routerMiddleware(history),
    sagaMiddleware
  )
);

sagaMiddleware.run(rootSaga);

// Remove preloaded user state
delete window.USER;


// =============================
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
