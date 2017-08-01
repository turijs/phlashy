import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route, Link } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';

import App from './components/App';

import reducers from './reducers';

// import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './sass/main.scss';


// Create the global history object
const history = createHistory();

console.log(window.USER);

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  {user: window.USER},
  applyMiddleware( routerMiddleware(history) )
);

delete window.USER;

let Test = () => <div>TEST</div>;


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
