import React from 'react';
import { connect } from 'react-redux';

const withLoginStatus = connect( state => ({loggedIn: state.user != null}), {} );

function LoggedInOnly({loggedIn, children, ...rest}) {
  return loggedIn ? <div {...rest}>{children}</div> : null;
}
LoggedInOnly = withLoginStatus(LoggedInOnly);

function LoggedOutOnly({loggedIn, children, ...rest}) {
  return !loggedIn ? <div {...rest}>{children}</div> : null;
}
LoggedOutOnly = withLoginStatus(LoggedOutOnly);


function OfflineOnly({offline, children, ...rest}) {
  return offline ? <div {...rest}>{children}</div> : null;
}
OfflineOnly = connect( ({offline}) => ({offline}), {} )(OfflineOnly);



export { LoggedInOnly, LoggedOutOnly, OfflineOnly };
