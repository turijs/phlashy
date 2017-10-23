import React from 'react';
import { connect } from 'react-redux';

const connected = connect( state => ({loggedIn: state.user != null}) );

function LoggedInOnly({loggedIn, children}) {
  return loggedIn ? <div className="logged-in">{children}</div> : null;
}
LoggedInOnly = connected(LoggedInOnly);

function LoggedOutOnly({loggedIn, children}) {
  return !loggedIn ? <div className="logged-out">{children}</div> : null;
}
LoggedOutOnly = connected(LoggedOutOnly);



export { LoggedInOnly, LoggedOutOnly };
