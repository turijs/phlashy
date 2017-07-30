import React from 'react';
import Header from './Header';
import {Route} from 'react-router';
import Login from './Login';

const App = () => (
  <div id="app">
    <Route component={Header} />
    <Route path="/login" component={Login} />
    <div className="container">
      <h1>Hello World!</h1>
    </div>

  </div>
);

export default App;
