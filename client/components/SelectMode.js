import React from 'react';
import Icon from './Icon';
import A from './A';

function SelectMode({active, onClick}) {
  let extraClass = active ? 'active' : '';
  return (
    <A className={`btn btn-slim select-mode ${extraClass}`} onClick={onClick}>
      <Icon fw slug={active ? 'times' : 'check'} />
      &nbsp;
      Select
    </A>
  )
}

export default SelectMode;
