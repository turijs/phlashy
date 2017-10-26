function getDay() {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24))
}

import seedRandom from 'seedrandom';

export function getCardOfDay(state) {
  let day = getDay();
  let rng = seedRandom(day);
  let cardIds = Object.keys(state.cards);
  let idOfDay = cardIds[ Math.floor(rng() * cardIds.length) ];
  return state.cards[idOfDay];
}
