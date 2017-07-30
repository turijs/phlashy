import React from 'react';
import SmartLink from './SmartLink';
import A from './A';
import onClickOutside from 'react-onclickoutside'

class UserMenu extends React.Component {
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
    let content;

    if(user)
      content = (
        <div>
          <A onClick={this.toggle}>{user.nickname}</A>
          <ul className={this.state.open ? "open" : null}>
            <li><SmartLink to="/profile">Profile</SmartLink></li>
            <li><A onClick={logout}>Logout</A></li>
          </ul>
        </div>
      );
    else
      content = <SmartLink to="/login">Login</SmartLink>;

    return <div id="user-menu">{content}</div>;
  }
}

// onClickOutside creates a HOC that calls the handleClickOutside handler
export default onClickOutside(UserMenu);
