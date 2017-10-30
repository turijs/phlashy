/*
 * Simple component to render an <a> that behaves like a button
 */
import React from 'react';

const A = ({onClick, disabled, ...rest}) => (
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    role="button"
    disabled={disabled}
    tabIndex={disabled ? -1 : undefined}
    {...rest}
  />
);

export default A;
