import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class SmartLink extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // prevent history.push if it would be a repeat
    if(this.props.to === this.props.location.pathname)
      e.preventDefault();
  }

  render() {
    let {to, replace, children} = this.props;
    return <Link
      onClick={this.handleClick} {...this.linkProps}
      to={to}
      replace={replace}
      children={children}
    />
  }
}

export default withRouter(SmartLink);
