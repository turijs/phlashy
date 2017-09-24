import {
  LOGIN, LOGOUT, UPDATE_USER,
  ADD_DECK, ADD_DECK_COMMIT, DELETE_DECK, LOAD_DECKS,
  REFRESH_SUCCEEDED
} from './actions';


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
      let {id, ...data} = action.deckData;
      return {...state, [id]: data };
    }
    case ADD_DECK_COMMIT: {
      let {id, ...data} = action.deckData;
      let newState = {...state, [id]: data };
      if(action.replaceTemp) delete newState[action.replaceTemp];
      return newState;
    }
    case DELETE_DECK: {
      let newState = {...state}
      delete newState[action.id];
      return newState;
    }
    case LOAD_DECKS:
    case REFRESH_SUCCEEDED: {
      let newState = {...state};
      for(let deck of action.decks) {
        let {id, ...data} = deck;
        newState[id] = data;
      }
      return newState;
    }


    default:
      return state;
  }
}


import {
  SELECT, DESELECT,
  SET_FILTER, CLEAR_FILTER,
  BEGIN_EDIT, CANCEL_EDIT,
} from './actions';

const defaultActiveView = {
  selected: [],
  filter: '',
  selectMode: false,
  editingItem: false
}

function activeView(state = defaultActiveView, action) {
  switch(action.type) {
    case SELECT:
      return {...state, selected: action.items, selectMode: true};

    case DESELECT:
      return {...state, selected: [], selectMode: false};

    case SET_FILTER:
      return {...state, filter: action.filter};

    case CLEAR_FILTER:
      return {...state, filter: ''};

    case BEGIN_EDIT:
      return {...state, editingItem: action.item};

    case CANCEL_EDIT:
    case ADD_DECK:
      return {...state, editingItem: false};


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
    default:
      return state;
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


export default {
  user,
  decks,
  activeView,
  viewPrefs,
  offline,
  modal,
  outbound
}

/*
{
  activeView: {
    selected: [],
    selectMode: false,
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
