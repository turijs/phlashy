import {
  LOGIN, LOGOUT, UPDATE_USER,
  ADD_DECK, DELETE_DECK, ADD_DECK_TEMP, LOAD_DECKS
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

let defaultDecks = {
  1: {name: 'Hello there', description: 'test deck 1'},
  5: {name: 'Italian', description: 'test deck 2'}
};

function decks(state = null, action) {
  switch(action.type) {
    case ADD_DECK: {
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
    case ADD_DECK_TEMP: {
      let {id, ...data} = action.deckData;
      return {...state, [id]: data };
    }
    case LOAD_DECKS: {
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


export default {
  user,
  decks
}
