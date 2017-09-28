import React from 'react';

const Icon = ({slug, sm, lg, xl, fw, alt, ...rest}) => {
  let classes = 'fa';
  if(slug) classes += ` fa-${slug}`
  if(sm) classes += ' fa-sm';
  if(lg) classes += ' fa-lg';
  if(xl) classes += ' fa-2x';
  if(fw) classes += ' fa-fw';

  return (
    <span className={classes} {...rest}>
      {alt &&
        <span className='sr-only'>{alt}</span>}
    </span>
  );
}

export default Icon;
