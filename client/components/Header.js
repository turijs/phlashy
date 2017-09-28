import React from 'react';
import { withRouter, NavLink, Link } from 'react-router-dom';
import A from './A';
import Popup from './Popup';
import SmartLink from './SmartLink';
import Icon from './Icon';

import { connect } from 'react-redux';
import { logout } from '../actions';

const Header = ({user, logout}) => (
  <header id="header">
    <div className="container">
      <div id="logo">
        <Link to="/">Phlashy</Link>
      </div>

      <nav id="nav">
        <ul>
        {user ? ([
          <li key="decks"><NavLink to="/decks">Decks</NavLink></li>,
          <li key="study"><NavLink to="/study">Study</NavLink></li>
        ]) : (
          <li><NavLink to="/about">About</NavLink></li>
        )}
        </ul>
      </nav>

      <AccountNav logout={logout} user={user} />
    </div>
  </header>
);

function mapStateToProps(state) {
  return {user: state.user};
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch( logout() )
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Header)
);

////////////////////

const AccountNav = ({user, logout}) => {
  let content;

  if(user)
    content = (
      <Popup
        id="user-menu"
        label={<span>{user.nickname} <Icon sm slug="chevron-down"/></span>}
      >
        <ul>
          <li><SmartLink to="/profile"><Icon fw slug="user"/> Profile</SmartLink></li>
          <li><A onClick={logout}><Icon fw slug="power-off"/> Logout</A></li>
        </ul>
      </Popup>
    );
  else
    content = <SmartLink className="btn" to="/login">Login</SmartLink>;

  return <div id="account-nav">{content}</div>;
}
