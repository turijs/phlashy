import React from 'react';
import A from './A';
import Icon from './Icon';
import cn from 'classnames';

function Check({on, inline = true, ...rest}) {
  return <A
    className={cn('btn btn-slim check', {active: on, fixalign: inline})}
    {...rest}
  >
    {on && <Icon slug="check" />}
  </A>
}

export default Check;
