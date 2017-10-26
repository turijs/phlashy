export default function pick(obj, ...keys) {
  let result = {};
  for(let key of keys)
    result[key] = obj[key];
  return result;
}
