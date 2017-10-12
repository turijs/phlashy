import React from 'react';
import A from './A';
import Icon from './Icon';
import cn from 'classnames';

function Check({on: active, onClick}) {
  return <A className={cn('btn btn-slim check', {active})} onClick={onClick} >
    {active && <Icon slug="check" />}
  </A>
}

export default Check;
