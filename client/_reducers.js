import {
  LOGIN, LOGOUT, UPDATE_USER,
  ADD_DECK, ADD_DECK_COMMIT, UPDATE_DECK, DELETE_DECK, LOAD_DECKS,
  ADD_CARD, ADD_CARD_COMMIT, UPDATE_CARD, DELETE_CARD,
  REFRESH_SUCCEEDED,
} from './actions';
import { REHYDRATE } from 'redux-persist/constants';

import itemListToIdMap from './util/item-list-to-id-map';


function user(state = null, action) {
  switch(action.type) {
    case LOGIN:
    case UPDATE_USER:
      return {...state, ...action.userData};

    case LOGOUT:
      return null;

    default:
      return state;
  }
}


function decks(state = null, action) {
  switch(action.type) {
    case ADD_DECK: {
      return {...state, [action.id]: action.deckData};
    }
    case ADD_DECK_COMMIT: {
      let newState = {...state, [action.id]: action.deckData };
      if(action.tempId) delete newState[action.tempId];
      return newState;
    }
    case UPDATE_DECK: {
      let {id, deckData: newData} = action;
      let oldData = state[id];
      return {...state, [id]: {...oldData, ...newData}};
    }
    case DELETE_DECK: {
      let newState = {...state}
      delete newState[action.id];
      return newState;
    }
    case LOAD_DECKS:
    case REFRESH_SUCCEEDED: {
      return action.decks;
    }
    case ADD_CARD:
    case ADD_CARD_COMMIT:
    case UPDATE_CARD:
    case DELETE_CARD: {
      let id = action.deckId;
      return {
        ...state,
        [id]: {
          ...state[id],
          modified: action.date,
          cards: deckCards(state[id].cards, action)
        }
      }
    }
    default:
      return state;
  }
}

// sub-reducer for cards list within deck
function deckCards(state, action) {
  switch(action.type) {
    case ADD_CARD:
      return [...state, action.id];
    case ADD_CARD_COMMIT: {
      let newState = [...state, action.id];
      if(action.tempId)
        return newState.filter(id => id != action.tempId);
      return newState;
    }
    case DELETE_CARD:
      return state.filter(id => id != action.id)
    default: return state;
  }
}


function cards(state = {}, action) {
  switch(action.type) {
    case ADD_CARD: {
      return {...state, [action.id]: action.cardData};
    }
    case ADD_CARD_COMMIT: {
      let newState = {...state, [action.id]: action.cardData };
      if(action.tempId) delete newState[action.tempId];
      return newState;
    }
    case UPDATE_CARD: {
      let {id, cardData: newData} = action;
      let oldData = state[id];
      return {...state, [id]: {...oldData, ...newData}};
    }
    case DELETE_CARD: {
      let newState = {...state}
      delete newState[action.id];
      return newState;
    }
    case REFRESH_SUCCEEDED: {
      return action.cards;
    }
    case REHYDRATE:
      return action.payload.cards || state;

    default: return state;
  }
}


import {
  SELECT, DESELECT, TOGGLE_SELECTING,
  SET_FILTER, CLEAR_FILTER,
  BEGIN_EDIT, CANCEL_EDIT,
  FLIP_CARDS,
} from './actions';

const defaultActiveView = {
  selected: [],
  flipped: {},
  filter: '',
  isSelecting: false,
  isEditing: false
}

function activeView(state = defaultActiveView, action) {
  switch(action.type) {
    case SELECT:
      return {...state, selected: action.items, isSelecting: true};

    case DESELECT:
      return {...state, selected: [], isSelecting: false};

    case TOGGLE_SELECTING:
      return {...state, selected: [], isSelecting: !state.isSelecting};

    case SET_FILTER:
      return {...state, filter: action.filter};

    case CLEAR_FILTER:
      return {...state, filter: ''};

    case BEGIN_EDIT:
      return {...state, isEditing: true};

    case CANCEL_EDIT:
    case ADD_DECK:
      return {...state, isEditing: false};

    case FLIP_CARDS: {
      let newFlipped = {...state.flipped};
      for(let id of action.ids)
        newFlipped[id] = !newFlipped[id];
      return {...state, flipped: newFlipped}
    }



    default:
      return state;
  }
}


import {SET_VIEW_MODE, SET_SORT} from './actions';

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
      return action.payload.viewPrefs || state;

    default: return state;
  }
}

import {
  STUDY_INIT, STUDY_BEGIN, STUDY_GO_BACK, STUDY_EXIT,
  NEXT_CARD, PREV_CARD,
  CARD_KNOWN, CARD_UNKNOWN,
} from './actions';

const studyStages = {
  CHOOSE_SRC: 'CHOOSE_SRC',
  CHOOSE_OPTS: 'CHOOSE_OPTS',
  STUDY: 'STUDY',
  SHOW_RESULTS: 'SHOW_RESULTS'
}

const defaultStudy = {
  stage: studyStages.CHOOSE_SRC,
  session: {
    cards: null,
    curIndex: 0,
    highestIndexReached: 0,
    numKnown: 0,
  }
  lastSelectedDecks: [],
}

function study(state = defaultStudy, action, fullState) {
  switch(action.type) {
    case STUDY_INIT: {
      let {decks, cards} = action;
      let newSelection = cards ? 'CUSTOM' : decks;

      let combinedCards = [];
      combinedCards.push(...cards);
      for(let deckId of decks)
        combinedCards.push(...fullState.decks[deckId].cards);

      return {
        stage: studyStages.CHOOSE_OPTS,
        session: { ...defaultStudy.session, cards: combinedCards },
        lastSelectedDecks: newSelection,
      }
    }

    case STUDY_BEGIN:
      return {...state, stage: studyStages.STUDY}

    case STUDY_GO_BACK: {
      if(state.stage == studyStages.CHOOSE_OPTS)
        return {...state, stage: studyStages.CHOOSE_SRC}
      else return state;
    }

    case STUDY_EXIT: {
      return {
        ...defaultStudy,
        lastSelectedDecks: state.lastSelectedDecks,
      }
    }

    case NEXT_CARD:
    case PREV_CARD:
    case CARD_KNOWN:
    case CARD_UNKNOWN:
      if(state.stage != studyStages.STUDY)
        return state;
      var {session} = state;
      // continue to next switch
  }
  switch(action.type) {
    case NEXT_CARD:
      if(session.curIndex == session.highestIndexReached) return state;

      return {
        ...state,
        session: {
          ...session,
          curIndex: session.curIndex + 1,
        }
      };

    case PREV_CARD:
      if(session.curIndex == 0) return state;

      return {
        ...state,
        session: {
          ...session,
          curIndex: session.curIndex - 1,
        }
      };

    case CARD_KNOWN: {
      let newSession = {...session, numKnown: session.numKnown + 1};
      let newState = {...state, session: newSession};


      if(session.curIndex == session.cards.length - 1) {
        // at the last card
        newState.stage = studyStages.SHOW_RESULTS;
      } else {
        newSession.highestIndexReached += 1;
        newSession.curIndex = newSession.highestIndexReached;
      }
      return newState;
    }

    case CARD_UNKNOWN: {
      let newState = {...state};

      if(session.curIndex == session.cards.length - 1) {
        newState.stage = studyStages.SHOW_RESULTS;
      } else {
        newState.session = {
          ...session,
          highestIndexReached: session.highestIndexReached + 1,
          curIndex: session.highestIndexReached + 1,
        }
      }
      return newState;
    }

    default: return state;
  }
}




import {CONNECTION_LOST, CONNECTION_GAINED} from './actions';

function offline(state = false, action) {
  switch(action.type) {
    case CONNECTION_LOST: return true;
    case CONNECTION_GAINED: return false;
    default: return state;
  }
}

import {DEQUEUE_OUTBOUND} from './actions';

/*
 *  Queue to store server-bound actions
 */
function outbound(state = [], action) {
  if(action.outbound)
    return [...state, action];
  else if(action.shouldDequeueOutbound)
    return state.slice(1);
  else
    return state;
}



import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from './util/combine-reducers-pass-full-state';

export default combineReducers({
  user,
  decks,
  cards,
  activeView,
  viewPrefs,
  study,
  offline,
  outbound,
  router
});

/*
{
  activeView: {
    selected: [],
    isSelecting: false,
    filter: '',
    // currentlyEditing
    flipped: [],
  }
  viewPrefs: {
    sort: {
      cards: {
        by: 'created',
        descending: false
      },
      decks: {
        by: 'created',
        descending: false
      },
    },
    mode: {
      cards: 'grid'
    }
  }
}
*/
