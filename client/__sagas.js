import { all, call, fork, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from './util/api';

import { LOCATION_CHANGE } from 'react-router-redux';
import {
  REQUEST_LOGOUT, LOGOUT, ADD_DECK_TEMP, ADD_DECK, FETCH_DECKS, LOAD_DECKS, LOGIN, DELETE_DECK,
  CONNECTION_GAINED, REFRESH, REFRESH_SUCCEEDED,
  logout, logoutFailed, refresh, addDeck, addDeckCommit, loadDecks, fetchDecks, connectionLost,
  genericActionCommit, genericActionFailed
} from './actions';

function* watchLoginCycle() {
  while(true) {
    let { willRehydrate } = yield take(LOGIN);

    // wait for rehydration if necessary
    if(willRehydrate)
      yield take(REHYDRATE);

    try {
      let subTasks = yield fork(function*(){
        yield all([
          watchRefresh(),
          autoRefresh(),
          watchOutbound()
        ]);
      });

      yield take(LOGOUT);
    } catch (e) {
      if(e == 'LOGGED_OUT')
        yield put( logout() );
      else throw e;
    }

    subTasks.cancel();
    yield api.post('/logout');
  }
}

function* autoRefresh() {
  // start by refreshing immediately
  yield put( refresh(true) );

  while(true) {
    let race = yield race({
      startOver: take(REFRESH_SUCCEEDED),
      beenAwhile: delay(60 * 1000),
      cameOnline: take(CONNECTION_GAINED)
    });

    if(race.beenAwhile || race.cameOnline)
      if( yield online() )
        yield put( refresh(true) );
  }
}

function* watchRefresh() {
  while(true) {
    yield take(REFRESH);

    if( yield offline() )
      continue;

    try {
      let {decks, cards} = yield all({
        decks: api.get('/decks').then(throw401)
      });
      yield put( refresh_succeeded(cards, decks) );
    } catch (e) {
      yield put( refresh_failed() );
      yield catchOffline(e);
    }
  }
}

function* watchConnection() {
  while(true) {
    yield take(CONNECTION_LOST);

    // periodically check connection
    while(true) {
      yield race({
        // user refresh causes a check to happen immediately
        refresh: take( REFRESH ),
        delay: delay(30000)
      });
      try {
        yield api.head('/ping');
        yield put( connectionGained() );
        break;
      } catch (e) {
        continue; // still offline...
      }
    }
  }
}

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




const processQueue = function() {
  function* doProcessing() {
    let queue = yield select(state => state.outbound);

    while(queue.length) {
      console.log(queue);
      let action = queue[0];
      yield handleAction(action);
      queue = yield select(state => state.outbound);
    }

  }

  var queueTask;

  // Only one queue process can happen at a time, no matter how
  // many times processQueue is called. Any calls that happen while
  // the queue is processing receive a promise that is resolved when
  // the queue empties.
  return function*() {
    if( !queueTask || !queueTask.isRunning() )
      queueTask = yield fork(doProcessing);

    return queueTask.done;
  }
}();

function throw401(res) {
  if(res.status == 401)
    throw 'LOGGED_OUT';
  return res;
}

function* catchOffline(e) {
  if(e == 'FETCH_FAILED')
    yield put( connectionLost() );
  else throw e;
}



function* watchOutbound() {
  while(true) {
    let action = yield take(action => action.outbound);
    // if we are online, process the queue immediately
    if( yield online() ) {
      try {
        yield processQueue();
      } catch(e) {
        yield catchOffline(e);
      }
    }
  }
}

function sendAction(action) {
  switch (action.type) {
    case ADD_DECK: {
      let {name, description} = action.deckData;
      return api.post('/decks', {name, description});
    }
    case DELETE_DECK: {
      return api.delete(`/decks/${action.id}`);
    }
  }
}

function* handleAction(action) {
  let delays = [
    30 * 1000,
    60 * 1000,
    5 * 60 * 1000,
    15 * 60 * 1000,
    30 * 60 * 1000,
    60 * 60 * 1000
  ];

  for(let t of delays) {
    let res = yield sendAction(action).then(throw401);
    if(res.ok) {
      // commit the action!
      return yield commitAction(action, res);
    } else {
      // otherwise there was a server error - delay and retry
      console.log('server error - trying again in ' + t);
      yield delay(t);
    }
  }

  // persist permanently failed
  yield failAction(action);
}

function* commitAction(action, res) {
  switch(action.type) {
    case ADD_DECK:
      let deckData = yield res.json();
      return yield put.resolve( addDeckCommit(deckData, action.deckData.id) );

    default:
      return yield put.resolve( genericActionCommit(action) );
  }
}

function* failAction(action) {
  return yield put.resolve( genericActionFailed(action) );
}

function* offline() {
  return yield select(state => state.offline);
}

function* online() {
  return !( yield select(state => state.offline) );
}

function* log() {
  while(true) {
    console.log(yield take('*'));
  }
}

function* rootSaga() {
  yield all([
    watchLoginCycle(),
    watchConnection()
  ]);
}

export default rootSaga;
