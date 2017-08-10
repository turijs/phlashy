import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import DecksView from './DecksView';

const Main = () => (
  <div className="container">
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/decks" component={DecksView} />
  </div>
);

export default Main;
