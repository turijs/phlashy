export default function arrayToMap(a) {
  let map = {};
  for(let item of a)
    map[item] = true;
  return map;
}
