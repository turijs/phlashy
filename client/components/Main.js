import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import DecksView from './DecksView';
import SingleDeckView from './SingleDeckView';
import Study from './Study';
import About from './About';

const Main = () => (
  <div className="container">
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route exact path="/decks" component={DecksView} />
    <Route path="/decks/:id" component={SingleDeckView} />
    <Route path="/study" component={Study} />
    <Route path="/about" component={About} />
  </div>
);

export default Main;
