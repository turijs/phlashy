import {
  LOGOUT,
  DELETE_DECK,
  ADD_CARD, ADD_CARD_COMMIT, UPDATE_CARD, DELETE_CARD,
  REFRESH_SUCCEEDED,
} from '../actions';
import { REHYDRATE } from 'redux-persist/constants';


function cards(state = {}, action, fullState) {
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

    case DELETE_DECK: {
      let newState = {...state}
      let deckId = action.id;
      let cardsToDelete = fullState.decks[deckId].cards;

      for(let id of cards)
        delete newState[id];

      return newState;
    }

    default: return state;
  }
}

export default cards;
