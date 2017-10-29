import {createSelector} from 'reselect';

export const getCards = state => state.cards;

/*=========== Card of the Day ===========*/

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

/*=========== Cards by Deck ===========*/

import {getDeck} from './decks';
import {getProp, filterableProps} from '../item-types/CARDS';
import {getNormalizedFilter, getSelected, listSelected, getFlipped} from './active-view';
import {filterItems, sortItems} from './helpers';

export const getCardsByDeck = createSelector(
  getCards,
  getDeck,
  (cards, deck) => {
    return deck ? deck.cards.map(id => cards[id]) : []
  }
);

export const getSortedCardsByDeck = createSelector(
  getCardsByDeck,
  state => state.prefs.view.sort.cards.by,
  state => state.prefs.view.sort.cards.desc,
  sortItems(getProp)
);

export const getFilteredCardsByDeck = createSelector(
  getSortedCardsByDeck,
  getNormalizedFilter,
  filterItems(getProp, filterableProps)
);

export const getFlaggedCardsByDeck = createSelector(
  getFilteredCardsByDeck,
  getFlipped,
  getSelected,
  (cards, flipped, selected) => cards.map(card => {
    let isFlp = flipped[card.id], isSel = selected[card.id];
    return (isFlp || isSel) ? {...card, selected: isSel, flipped: isFlp} : card;
  })
);

export const getSelectedCards = createSelector(
  getCards,
  listSelected,
  (cards, selected) => {
    selected.cards = selected.map(id => cards[id]);
    return selected;
  }
)
