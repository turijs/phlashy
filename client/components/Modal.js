import React from 'react';
import AriaModal from 'react-aria-modal';
import cn from 'classnames';
import Keyboard from './Keyboard';

const getApplicationNode = () => document.getElementById('root');

// const Modal = ({show, className, onClose, ...rest}) => show ? (
//   <div {...rest}>
//     <div className="modal-window">{children}</div>
//     <div className="modal-bg" onMouseDown={onClose} />
//   </div>
// ) : null;

const Modal = ({
  show,
  children,
  className,
  onClose,
  ...rest
}) => {
  if( !(rest.titleText || rest.titleId) ) rest.titleText = 'Dialog';
  return (
    <AriaModal
      mounted={show}
      onExit={onClose}
      getApplicationNode={getApplicationNode}
      includeDefaultStyles={false}
      dialogClass={cn('modal-window', className)}
      underlayClass="modal-bg"
      {...rest}
    >
      {children}
      <Keyboard newScope />
    </AriaModal>
  )
}


export default Modal;
