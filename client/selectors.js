import {createSelector} from 'reselect';

const getCards = state => state.cards;

function getDay() {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24))
}

import seedRandom from 'seedrandom';

export const getCardOfDay = createSelector(
  getCards, getDay,
  (cards, day) => {
    let rng = seedRandom(day);
    let cardIds = Object.keys(cards);
    let idOfDay = cardIds[ Math.floor(rng() * cardIds.length) ];
    return cards[idOfDay];
  }
);
