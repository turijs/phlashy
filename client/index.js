import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import localForage from 'localforage';
import { createPersistor, getStoredState } from 'redux-persist';

import App from './components/App';
import reducer from './reducers';
import rootSaga from './sagas';
import { login, skipRehydration } from './actions';

// styles
import './sass/base.scss';

// init history object for router
const history = createHistory();

// init Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// redux devTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(rootSaga);

// login with preloaded user, BEFORE persistor created
if(window.USER)
  store.dispatch( login(USER) );

handlePersistence();


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

/*===== Helper functions =====*/

async function handlePersistence() {
  const persistConfig = {
    storage: localForage,
    keyPrefix: 'phlashy:',
    blacklist: ['router']
  }
  // persist the store
  const persistor = createPersistor(store, persistConfig);
  persistor.pause();

  // handle rehydration
  try {
    if(window.USER) {
      let state = await getStoredState(persistConfig);
      if(state.user && state.user.id == window.USER.id)
        persistor.rehydrate(state);
      else
        store.dispatch( skipRehydration() );
    } else {
      store.dispatch( skipRehydration() );
      persistor.purge();
    }
  } catch(e) { console.log(e) }

  persistor.resume();
  delete window.USER;
}
