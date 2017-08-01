import React from 'react';
import Header from './Header';
import {Route} from 'react-router';
import Login from './Login';

const App = () => (
  <div id="app">
    <Route component={Header} />

    <div className="container">
      <h1>Welcome Back!</h1>
      <Route path="/login" component={Login} />
    </div>

  </div>
);

export default App;
