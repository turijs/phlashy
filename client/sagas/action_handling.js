import {delay} from 'redux-saga';
import {put} from 'redux-saga/effects';
import api from '../util/api';
import {
  ADD_DECK, DELETE_DECK, UPDATE_DECK,
  ADD_CARD, DELETE_CARD, UPDATE_CARD,
  UPDATE_NICKNAME, UPDATE_EMAIL, UPDATE_PASSWORD
} from '../actions';

const defaultDelays = [
  30 * 1000,
  60 * 1000,
  5 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000
];

/*
 * Robustly (hopefully) handle a single outbound action.
 * Relies on the three helper functions below
 */
export default function* handleAction(action, delays = defaultDelays) {
  retry:
  for(let i = 0;; i++) {
    let mili = delays[i];
    try {
      let res = yield sendAction(action);
      // commit the action!
      return yield commitAction(action, res);
    } catch (e) {
      if(e.status == 0 || e.status == 401)
        throw e;

      if(e.status >= 500 && seconds) {
        yield delay(mili);
        continue;
      }

      // persist permanently failed
      return yield failAction(action, e.res);
    }
  }
}

/*
 * Makes the appropriate api request for the provided action
 */
export function sendAction(action) {
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

    case UPDATE_NICKNAME: {
      return api.put('/user/nickname', {nickname: action.value});
    }
    case UPDATE_EMAIL: {
      return api.put('/user/email', {email: action.value});
    }
    case UPDATE_PASSWORD: {
      return api.put('/user/password', {
        oldPassword: action.oldPw,
        newPassword: action.newPw
      });
    }
  }
}

import {
  addDeckCommit, addCardCommit,
  updateNicknameCommit, updateEmailCommit,
  genericActionCommit, genericActionFailed
} from '../actions';

/*
 * Issues an appropriate commit action on success
 */
export function* commitAction(action, res) {
  switch(action.type) {
    case ADD_DECK: {
      let deckData = yield res.json();
      return yield put.resolve( addDeckCommit(deckData, action.id) );
    }
    case ADD_CARD: {
      let cardData = yield res.json();
      return yield put.resolve( addCardCommit(cardData, action.deckId, action.id) );
    }

    case UPDATE_NICKNAME: {
      return yield put.resolve( updateNicknameCommit(action.value) );
    }
    case UPDATE_EMAIL: {
      return yield put.resolve( updateEmailCommit(action.value) );
    }

    default:
      return yield put.resolve( genericActionCommit(action) );
  }
}

/*
 * Issues an appropriate failure action
 */
export function* failAction(action, res) {
  switch(action.type) {
    case UPDATE_NICKNAME:
    case UPDATE_EMAIL:
    case UPDATE_PASSWORD: {
      let error;
      if(e.status == 0) {
        error = 'Lost connection';
      } else {
        let body = yield res.json();
        error = body.error || body.errors;
      }
      return yield put.resolve( genericActionFailed(action, {error}) );
    }

    default:
      return yield put.resolve( genericActionFailed(action) );
  }
}
