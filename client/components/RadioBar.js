import React from 'react';
import A from './A';

const RadioBar = ({options, value, onChange, className: classes}) => (
  <div className={'radio-bar '+(classes || '')}>
    {options.map(option => (
      <A
        key={option.value}
        onClick={() => onChange(option)}
        className={'btn btn-slim'+(option.value == value ? ' active' : '')}
      >
        {option.label}
      </A>
    ))}
  </div>
);

export default RadioBar;
