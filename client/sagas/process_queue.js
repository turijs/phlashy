import { delay } from 'redux-saga';
import { fork, put, select } from 'redux-saga/effects';
import api, { rejectErrors } from '../util/api';
import catchOffline from './util';

/*
 * Actual queue processing happens here
 */
function* doProcessing() {
  let queue = yield select(state => state.outbound);

  while(queue.length) {
    let action = queue[0];
    yield handleAction(action);
    queue = yield select(state => state.outbound);
  }
}

var queueTask;

/*
 * Only one queue process can happen at a time, no matter how
 * many times processQueue is called. Any calls that happen while
 * the queue is processing receive a promise that is resolved when
 * the queue empties.
 */
export default function* processQueue() {
  if( !queueTask || !queueTask.isRunning() )
    queueTask = yield fork(doProcessing);

  return queueTask.done;
}


const delays = [
  30 * 1000,
  60 * 1000,
  5 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000
];

/*
 * Robustly (hopefully) handle a single outbound action from the queue.
 * Relies on the three helper functions below
 */
function* handleAction(action) {
  for(let t of delays) {
    try {
      let res = yield sendAction(action).then(rejectErrors);
      // commit the action!
      return yield commitAction(action, res);
    } catch (e) {
      if(e == 'SERVER_ERROR')
        yield delay(t);
      else throw e;
    }
  }
  // persist permanently failed
  yield failAction(action);
}

import {
  ADD_DECK, DELETE_DECK, UPDATE_DECK,
  ADD_CARD, DELETE_CARD, UPDATE_CARD,
  addDeckCommit, addCardCommit,
  genericActionCommit, genericActionFailed
} from '../actions';

/*
 * Makes the appropriate api request for the provided action
 */
function sendAction(action) {
  switch (action.type) {
    case ADD_DECK: {
      return api.post('/decks', action.deckData);
    }
    case UPDATE_DECK: {
      return api.put(`/decks/${action.id}`, action.deckData);
    }
    case DELETE_DECK: {
      return api.delete(`/decks/${action.id}`);
    }

    case ADD_CARD: {
      return api.post('/cards', {...action.cardData, deckId: action.deckId});
    }
    case UPDATE_CARD: {
      return api.put(`/cards/${action.id}`, action.cardData);
    }
    case DELETE_CARD: {
      return api.delete(`/cards/${action.id}?when=${encodeURIComponent(action.date)}`);
    }
  }
}

/*
 * Issues an appropriate commit action on success
 */
function* commitAction(action, res) {
  switch(action.type) {
    case ADD_DECK: {
      let deckData = yield res.json();
      return yield put.resolve( addDeckCommit(deckData, action.id) );
    }
    case ADD_CARD: {
      let cardData = yield res.json();
      return yield put.resolve( addCardCommit(cardData, action.deckId, action.id) );
    }
    default:
      return yield put.resolve( genericActionCommit(action) );
  }
}

/*
 * Issues an appropriate failure action
 */
function* failAction(action) {
  return yield put.resolve( genericActionFailed(action) );
}
