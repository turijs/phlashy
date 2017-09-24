/*
 * Simple component to render an <a> that behaves like a button
 */
import React from 'react';

const A = ({onClick, ...rest}) => (
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    role="button"
    {...rest}
  >
    {/* {children} */}
  </a>
);

export default A;
