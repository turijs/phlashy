import { all, call, put, take, takeEvery } from 'redux-saga/effects';
import api from './util/api';

import { LOCATION_CHANGE } from 'react-router-redux';
import {
  REQUEST_LOGOUT, ADD_DECK_TEMP, FETCH_DECKS, LOAD_DECKS, LOGIN, DELETE_DECK,
  logout, logoutFailed, addDeck, loadDecks, fetchDecks
} from './actions';


function* watchLogout() {
  while(true) {
    yield take(REQUEST_LOGOUT);
    let res = yield api.post('/logout');
    if(res.ok)
      yield put( logout() );
    else
      yield put( logoutFailed() );
  }
}

function* watchLogin() {
  while(true) {
    yield take(LOGIN);
    yield put( fetchDecks() );
    console.log(call(alert, 'hi'));
  }
}

function* watchAddDeck() {
  yield takeEvery(ADD_DECK_TEMP, function*(action) {
    let {name, description, id: tempID} = action.deckData;
    let res = yield api.post('/decks', {name, description});
    if(res.ok) {
      let deckData = yield res.json();
      yield put( addDeck(deckData, tempID) )
    } else {
      console.log("couldn't add deck");
    }
  });
}

function* watchDeleteDeck() {
  yield takeEvery(DELETE_DECK, function*(action) {
    let res = yield api.delete(`/decks/${action.id}`);
  });
}

function* watchFetchDecks() {
  while(true) {
    try {
      yield take(FETCH_DECKS);
      let res = yield api.get('/decks');
      if(res.ok) {
        let decks = yield res.json();
        yield put( loadDecks(decks) );
      }
    } catch (e) {
      console.log(e);
    }

  }
}


function* log() {
  while(true) {
    console.log(yield take('*'));
  }
}

function* rootSaga() {
  yield all([
    log(),
    watchLogout(),
    watchLogin(),
    watchAddDeck(),
    watchDeleteDeck(),
    watchFetchDecks()
  ]);
}

export default rootSaga;
