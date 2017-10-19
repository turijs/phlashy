import React from 'react';
import A from './A';
import onClickOutside from 'react-onclickoutside';
import cn from 'classnames';

class Popup extends React.Component {
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

  handleMenuClick = () => {
    if(this.props.closeOnMenuClick)
      this.toggle();
  }

  render() {
    let {children, label, title, className, id} = this.props;
    let {open} = this.state;

    return (
      <div className={cn('popup', {open}, className)} id={id}>
        <A className="popup-link" onClick={this.toggle} title={title}>
          {label}
        </A>
        <div className="popup-menu" onClick={this.handleMenuClick}>
          {children}
        </div>
      </div>
    );
  }

}

Popup.defaultProps = {
  closeOnMenuClick: false,
}

export default onClickOutside(Popup);
