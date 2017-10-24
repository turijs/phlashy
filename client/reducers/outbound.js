import {
  ADD_DECK_COMMIT, UPDATE_DECK, DELETE_DECK,
  ADD_CARD_COMMIT, ADD_CARD, UPDATE_CARD, DELETE_CARD,
} from '../actions'

/*
 *  Queue to store server-bound actions
 */

function outbound(state = [], action) {
  if(action.outbound && !action.outbound.sync)
    return [...state, action];

  else if(action.shouldDequeueOutbound)
    switch(action.type) {
      // replace IDs in rest of queued actions
      case ADD_DECK_COMMIT:
      case ADD_CARD_COMMIT:
        return state.slice(1).map( idResolver(action.tempId, action.id) );

      default:
        return state.slice(1);
    }

  else return state;
}

export default outbound;

/*=========== Helper Functions ============*/

const idResolver = (oldId, newId) => action => {
  for(idKey of [id, deckId])
    if(action[idKey] === oldId)
      return {...action, [idKey]: newId};

  return action;
}
