import React from 'react';
import Spinner from './Spinner';

function AsyncButton({loading, disabled, children, ...rest}) {
  return (
    <button disabled={disabled || loading} {...rest}>
      {children} {loading && <Spinner size={16} />}
    </button>
  )
}

export default AsyncButton;
