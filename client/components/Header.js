import React from 'react';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AccountNav from './AccountNav';
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
