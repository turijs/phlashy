import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import App from './components/App';
import reducers from './reducers';
import rootSaga from './sagas';
import { login } from './actions';

// CSS
import 'font-awesome/css/font-awesome.css';
import './sass/main.scss';

// init history object for router
const history = createHistory();

// init Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// redux devTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  )
);

// Start the sagas
sagaMiddleware.run(rootSaga);

// login with preloaded user
if(window.USER) {
  store.dispatch( login(window.USER) );
  delete window.USER;
}


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
