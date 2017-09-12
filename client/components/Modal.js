import React from 'react';

function Modal({show, children, onClickOutside, ...rest}) {
  var clickProps = onClickOutside ? {onMouseDown: onClickOutside} : {};
  return show ? (
    <div {...rest}>
      <div className="modal-window">{children}</div>
      <div className="modal-bg" {...clickProps} />
    </div>
  ) : null;
}

export default Modal;
