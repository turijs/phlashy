/*
 * Knuth (Fisher-Yates) shuffle
 */

function shuffle(a) {
  for(let i = a.length - 1; i > 0; i--) {
    let r = Math.floor(Math.random() * (i+1))
    let temp = a[i];
    a[i] = a[r];
    a[r] = temp;
  }
  return a;
}

export default shuffle;
