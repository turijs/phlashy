import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route, Link } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';

// import 'bootstrap/dist/css/bootstrap.css';
import './css/main.css';

// Create the global history object
const history = createHistory();

const store = createStore(
  combineReducers({
    router: routerReducer
  }),
  applyMiddleware( routerMiddleware(history) )
);


function App() {
  return (
    <div className="well">
      <h1>Hello World!</h1>
      <Link to="/test">Test link</Link>
      <Route path="/test" component={Test} />

    </div>
  );
}

function Test() {
  return <div>TEST</div>
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
  document.getElementById('app')
);

//<ConnectedRouter history={history}>
//  <App />
//</ConnectedRouter>
