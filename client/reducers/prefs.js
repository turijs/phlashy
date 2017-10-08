import { REHYDRATE } from 'redux-persist/constants';

/*======== View (active) =========*/

import {SET_VIEW_MODE, SET_SORT} from '../actions';

const defaultViewPrefs = {
  mode: {
    cards: 'grid',
    decks: 'grid'
  },
  sort: {
    cards: {
      by: 'created',
      descending: false
    },
    decks: {
      by: 'created',
      descending: false
    },
  }
};

function view(state = defaultViewPrefs, action) {
  switch(action.type) {
    case SET_VIEW_MODE:
      return {
        ...state,
        mode: { ...state.mode, [action.itemType]: action.mode }
      }
    case SET_SORT:
      return {
        ...state,
        sort: { ...state.sort, [action.itemType]: action.sort }
      }
    case REHYDRATE:
      return action.payload.prefs.view || state;

    default: return state;
  }
}

import combineReducers from '../util/combine-reducers-pass-full-state';

export default combineReducers({
  view,
})
