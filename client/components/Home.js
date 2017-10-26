import React from 'react';
import Signup from './Signup';
import Spinner from './Spinner';
import { LoggedInOnly, LoggedOutOnly } from './app-conditional';

const Home = () => (
  <div id="home">
    <LoggedOutOnly>
      <Signup />
    </LoggedOutOnly>
    <LoggedInOnly>
      <h1>Welcome!</h1>
    </LoggedInOnly>
  </div>
);

export default Home;
