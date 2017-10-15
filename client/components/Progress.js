import React from 'react';
import cn from 'classnames';

class Progress extends React.Component {
  atZero = this.props.animateOnMount;

  componentDidMount() {
    if(this.props.animateOnMount) {
      setTimeout(() => {
        this.atZero = false;
        this.forceUpdate();
      }, 50);
    }
  }

  render() {
    let {percent, thick} = this.props;
    if(this.atZero) percent = 0;

    return (
      <div className={cn('progress', {thick})}>
        <div className="progress-bar" style={{width: percent+'%'}}></div>
      </div>
    )
  }

}

export default Progress;
