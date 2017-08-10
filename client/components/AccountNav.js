import React from 'react';
import SmartLink from './SmartLink';
import A from './A';
import Icon from './Icon';
import onClickOutside from 'react-onclickoutside'

class AccountNav extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {open: false};
  }

  toggle() {
    this.setState({open: !this.state.open});
  }

  handleClickOutside() {
    this.setState({open: false});
  }

  render() {
    let {user, logout} = this.props;
    let {open} = this.state;
    let content;

    if(user)
      content = (
        <div id="user-menu" className={open ? "open" : null}>
          <A onClick={this.toggle}>
            {user.nickname} <Icon sm slug={open ? 'chevron-up' : 'chevron-down'}/>
          </A>
          <ul>
            <li><SmartLink to="/profile"><Icon slug="user"/> Profile</SmartLink></li>
            <li><A onClick={logout}><Icon slug="power-off"/> Logout</A></li>
          </ul>
        </div>
      );
    else
      content = <SmartLink className="btn" to="/login">Login</SmartLink>;

    return <div id="account-nav">{content}</div>;
  }
}



// onClickOutside creates a HOC that calls the handleClickOutside handler
export default onClickOutside(AccountNav);
