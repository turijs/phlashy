import React from 'react';

function Modal({show, children, onClickOutside}) {
  var clickProps = onClickOutside ? {onMouseDown: onClickOutside} : {};
  return show ? (
    <div>
      <div className="modal-window">{children}</div>
      <div className="modal-bg" {...clickProps} />
    </div>
  ) : null;
}

export default Modal;
