function itemListToIdMap(list, idKey = 'id') {
  let map = {};
  for(let {[idKey]: id, ...data} of list)
    map[id] = data;
  return map;
}

export default itemListToIdMap;
