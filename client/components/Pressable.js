import React from 'react';

let lastMouseDown;

class Pressable extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleMouseDown(e) {
    lastMouseDown = Date.now();
    if(this.props.onMouseDown)
      this.props.onMouseDown(e);
  }

  handleClick(e) {
    let {onClick, pressDelay = 700} = this.props;
    let press = Date.now() - lastMouseDown > pressDelay;
    if(onClick)
      onClick(e, press);
  }

  render() {
    let {
      children,
      onClick,
      onMouseDown,
      pressDelay,
      ...rest
    } = this.props;

    return (
      <div onClick={this.handleClick} onMouseDown={this.handleMouseDown} {...rest}>
        {children}
      </div>
    );
  }
}

export default Pressable;
