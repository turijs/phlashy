import React from 'react';
import Icon from '../Icon';
import A from '../A';
import cn from 'classnames';

function toggleSelecting({active, onClick}) {
  return (
    <A className={cn('btn btn-slim toggle-selecting', {active})} onClick={onClick}>
      <Icon fw slug={active ? 'times' : 'check'} />
      &nbsp;
      Select
    </A>
  )
}

export default toggleSelecting;
