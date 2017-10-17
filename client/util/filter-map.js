export default function filterMap(a, mapper, start = 0) {
  var mapped = [], newVal;
  for(let i = 0; i < a.length; i++)
    if( newVal = mapper(a[i], i, a) )
      mapped.push(newVal);

  return mapped;
}
