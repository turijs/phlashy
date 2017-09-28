var idMap = {};

export default function resolveID(temp, perm) {
  if(perm) idMap[temp] = perm;
  else return idMap[temp];
}
