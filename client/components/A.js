/*
 * Simple component to render an <a> that behaves like a button
 */
import React from 'react';

const A = ({onClick, children, className}) => (
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    className={className}
  >
    {children}
  </a>
);

export default A;
