import {createSelector} from 'reselect';

export const getFilter = state => state.activeView.filter;

export const getNormalizedFilter = state => getFilter(state).toLowerCase();

export const getSelected = ({activeView}) => activeView.selected;

export const getFlipped = ({activeView}) => activeView.flipped;

export const listSelected = createSelector(
  getSelected,
  sel => Object.entries(sel).filter(pair => pair[1]).map(pair => pair[0])
)
