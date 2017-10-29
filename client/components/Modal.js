import React from 'react';
import combokeys from '../util/combokeys';

class Modal extends React.Component {
  componentDidMount() {
    if(this.props.onClose)
      combokeys.bindGlobal('esc', this.props.onClose)
  }
  componentWillUnmount() { combokeys.unbind('esc') }

  render() {
    let { show, children, onClose, ...rest } = this.props

    return show ? (
      <div {...rest}>
        <div className="modal-window">{children}</div>
        <div className="modal-bg" onMouseDown={onClose} />
      </div>
    ) : null;
  }
}

export default Modal;
