function itemListToIdMap(list, idKey = 'id') {
  let map = {};
  for(let item of list)
    map[item[idKey]] = item;
  return map;
}

export default itemListToIdMap;
