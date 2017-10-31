import {createSelector} from 'reselect';

export const getFilter = state => state.activeView.filter;

export const getNormalizedFilter = state => getFilter(state).toLowerCase();

export const getSelected = ({activeView}) => activeView.selected;

export const getFlipped = ({activeView}) => activeView.flipped;

export const listSelected = createSelector(
  getSelected,
  sel => Object.entries(sel).filter(pair => pair[1]).map(pair => pair[0])
);


import {matchPath} from 'react-router';
import {getFilteredDecks, getFilteredCardsByDeck} from '.';

export const getActiveFilteredItems = state => {
  let {pathname} = state.router.location;

  let match = matchPath(pathname, {path: '/decks'});

  if( !match )
    return [];
  if(match.isExact)
    return getFilteredDecks(state);

  match = matchPath(pathname, {path: '/decks/:id-:name'});
  return getFilteredCardsByDeck(state, match.params);
}

export const getActiveFilteredIds = createSelector(
  getActiveFilteredItems,
  items => items.map(item => item.id)
)

export const areAllSelected = createSelector(
  getActiveFilteredItems,
  getSelected,
  (items, selected) => !!items.length && items.every(item => selected[item.id])
);
