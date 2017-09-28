import {
  LOGIN, LOGOUT, UPDATE_USER,
  ADD_DECK, ADD_DECK_COMMIT, UPDATE_DECK, DELETE_DECK, LOAD_DECKS,
  ADD_CARD, ADD_CARD_COMMIT, UPDATE_CARD, DELETE_CARD,
  REFRESH_SUCCEEDED,
} from './actions';
import { REHYDRATE } from 'redux-persist/constants';


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
      let newState = {};
      for(let deck of action.decks) {
        let {id, ...data} = deck;
        newState[id] = data;
      }
      return newState;
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


function cards(state = null, action) {
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
      let newState = {};
      for(let card of action.cards) {
        let {id, ...data} = card;
        newState[id] = data;
      }
      return newState;
    }
    default:
      return state;
  }
}


import {
  SELECT, DESELECT, TOGGLE_SELECTING,
  SET_FILTER, CLEAR_FILTER,
  BEGIN_EDIT, CANCEL_EDIT,
} from './actions';

const defaultActiveView = {
  selected: [],
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
    case REHYDRATE: return action.payload.viewPrefs;
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

import {SHOW_MODAL, HIDE_MODAL} from './actions';

function modal(state = false, action) {
  switch(action.type) {
    case SHOW_MODAL:
      return action.modalName;
    case HIDE_MODAL:
      return false;
    default:
      return state;
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
import { combineReducers } from 'redux';

export default combineReducers({
  user,
  decks,
  activeView,
  viewPrefs,
  offline,
  modal,
  outbound,
  router
});

/*
{
  activeView: {
    selected: [],
    isSelecting: false,
    filter: '',
    currentlyEditing
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
