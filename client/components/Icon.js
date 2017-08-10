import React from 'react';

const Icon = ({slug, sm, lg}) => {
  let classes = `fa fa-${slug}`;
  if(sm) classes += ' fa-sm';
  if(lg) classes += ' fa-lg';

  return <span className={classes}></span>
}

export default Icon;
