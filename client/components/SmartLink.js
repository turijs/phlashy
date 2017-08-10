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
    let {to, replace, children, className} = this.props;
    return <Link
      onClick={this.handleClick}
      to={to}
      replace={replace}
      children={children}
      className={className}
    />
  }
}

export default withRouter(SmartLink);
