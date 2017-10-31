import React from 'react';
import cn from 'classnames';

const Icon = ({className, slug, sm, lg, xl, fw, alt, ...rest}) => {
  let classes = cn(className, 'icon fa', {
    [`fa-${slug}`]: slug,
    'fa-sm': sm,
    'fa-lg': lg,
    'fa-2x': xl,
    'fa-fw': fw
  });

  return (
    <span className={classes} {...rest}>
      {alt &&
        <span className='sr-only'>{alt}</span>}
    </span>
  );
}

export default Icon;
