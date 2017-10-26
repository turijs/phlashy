import React from 'react';
import Header from './Header';
import {Route} from 'react-router';
import Main from './Main';
import OfflineIndic from './OfflineIndic';

const App = () => (
  <div id="app">
    <OfflineIndic />
    <Header />
    <Main />
  </div>
);

export default App;
