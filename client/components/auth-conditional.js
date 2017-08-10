import React from 'react';
import { connect } from 'react-redux';

function LoggedInOnly({loggedIn, children}) {
  return loggedIn ? <div className="logged-in">{children}</div> : null;
}
LoggedInOnly = connect(mapStateToProps)(LoggedInOnly);

function LoggedOutOnly({loggedIn, children}) {
  return !loggedIn ? <div className="logged-out">{children}</div> : null;
}
LoggedOutOnly = connect(mapStateToProps)(LoggedOutOnly);

function mapStateToProps(state) {
  return {loggedIn: state.user != null}
}

export { LoggedInOnly, LoggedOutOnly };
