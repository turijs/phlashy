import {
  LOGOUT,
  ADD_DECK, ADD_DECK_COMMIT, UPDATE_DECK, DELETE_DECK,
  ADD_CARD, ADD_CARD_COMMIT, UPDATE_CARD, DELETE_CARD,
  REFRESH_SUCCEEDED,
} from '../actions';
import { REHYDRATE } from 'redux-persist/constants';

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

export default decks;

/*
 * sub-reducer for cards list within deck
 */
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
