export const getFilter = state => state.activeView.filter;

export const getNormalizedFilter = state => getFilter(state).toLowerCase();

export const getSelected = ({activeView}) => activeView.selected;

export const getFlipped = ({activeView}) => activeView.flipped;
