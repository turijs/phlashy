export const sortItems = getProp =>
  (items, sortBy, desc) => items.slice().sort((a, b) => {
    a = getProp(a, sortBy), b = getProp(b, sortBy);
    if(typeof a == 'string')
      a = a.toUpperCase(), b = b.toUpperCase();
    return ( a < b ? -1 : +(a !== b) ) * (desc ? -1 : 1);
  });

export const filterItems = (getProp, filterableProps) =>
  (items, filter) => items.filter(item =>
    filterableProps.some(prop =>
      getProp(item, prop).toLowerCase().includes(filter)
    )
  );
