import {createSelector} from 'reselect';
import {getProp, filterableProps} from '../item-types/DECKS';
import {getNormalizedFilter, getSelected, listSelected} from './active-view';
import {filterItems, sortItems} from './helpers';

export const getDecks = state => state.decks;
export const getDeck = (state, {id}) => state.decks[id];

export const getDecksList = createSelector(
  getDecks,
  decks => Object.values(decks)
);

// This function (and the next) mutates the decks list, but that's ok..
export const getSortedDecks = createSelector(
  getDecksList,
  state => state.prefs.view.sort.decks.by,
  state => state.prefs.view.sort.decks.desc,
  sortItems(getProp)
);

export const getFilteredDecks = createSelector(
  getSortedDecks,
  getNormalizedFilter,
  filterItems(getProp, filterableProps)
);

export const getFlaggedDecks = createSelector(
  getFilteredDecks,
  getSelected,
  (decks, selected) => decks.map(deck =>
    selected[deck.id] ? {...deck, selected: true} : deck
  )
);

export const getSelectedDecks = createSelector(
  getDecks,
  listSelected,
  (decks, selected) => {
    selected.decks = selected.map(id => decks[id]);
    return selected;
  }
)
