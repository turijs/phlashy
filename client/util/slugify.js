/*
 * Courtesy of Peter Boughton's SO answer
 */
export default function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
}
