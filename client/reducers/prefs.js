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

function viewPrefs(state = defaultViewPrefs, action) {
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
      let {prefs} = action.payload;
      return (prefs && prefs.view) || state;

    default: return state;
  }
}

import {TOGGLE_SHUFFLE, TOGGLE_FRONT_BACK} from '../actions';

const defaultStudyPrefs = {
  shuffle: true,
  backToFront: false
}

function studyPrefs(state = defaultStudyPrefs, action) {
  switch(action.type) {
    case TOGGLE_SHUFFLE:
      return {...state, shuffle: !state.shuffle};

    case TOGGLE_FRONT_BACK:
      return {...state, backToFront: !state.backToFront};

    default: return state;
  }
}

import combineReducers from '../util/combine-reducers-pass-full-state';

export default combineReducers({
  view: viewPrefs,
  study: studyPrefs
})
