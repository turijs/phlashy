import React from 'react';

const defaultPressDelay = 600;

class Pressable extends React.Component {
  constructor(props) {
    super(props);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.resetPressTimer = this.resetPressTimer.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);

    this.press = false;
    this.touchStarted = false;
  }

  handleTouchStart() {
    let {onPress, pressDelay = defaultPressDelay} = this.props;

    this.touchStarted = true;

    if(onPress)
      this.pressTimer = setTimeout(this.handlePress, pressDelay);
  }

  resetPressTimer() {
    if(this.touchStarted) this.touchStarted = false;
    if(this.pressTimer)
      this.pressTimer = clearTimeout(this.pressTimer);
  }

  handleMouseDown(e) {
    let {onDown, onPress, pressDelay = defaultPressDelay} = this.props;

    this.press = false;

    if(onDown)
      onDown(e);

    if(onPress && !this.pressTimer && e.button == 0)
      this.pressTimer = setTimeout(this.handlePress, pressDelay)
  }



  handleClick(e) {
    this.resetPressTimer();

    if(this.press)
      return e.preventDefault();

    if(this.props.onClick)
      this.props.onClick(e);
  }

  handlePress() {
    this.press = true;
    this.props.onPress();
  }

  render() {
    let {
      children,
      onClick,
      onDown,
      pressDelay,
      onPress,
      ...rest
    } = this.props;

    return (
      <div
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.resetPressTimer}
        onTouchMove={this.resetPressTimer}
        onContextMenu={e => {
          // prevent press from triggering context menu
          if(this.touchStarted || this.press)
            e.preventDefault();
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
}

export default Pressable;
