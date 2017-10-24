import {delay} from 'redux-saga';
import {all, put, race, take} from 'redux-saga/effects';
import api, {toJSON} from '../util/api';
import { REFRESH, refresh, refresh_succeeded, refresh_failed } from '../actions';
import { offline, online, catchOffline } from './util';
import queue from './queue';
import {tryReconnect} from './connection';

export default function* watchRefresh() {
  while(true) {
    yield take(REFRESH);

    try {
      if( ( yield offline() ) && !( yield tryReconnect() ) )
        throw 'offline';

      // process the outbound queue before pulling data from the server
      yield queue.process();

      let {cards, decks} = yield all({
       decks: api.get('/decks').then(toJSON),
       cards: api.get('/cards').then(toJSON)
      });
      yield put( refresh_succeeded(decks, cards) );
    } catch (e) {
      yield put( refresh_failed() );
      yield catchOffline(e);
      if(e.status == 401) throw e;
      console.log(e);
    }
  }
}

/*========== Auto Refresh =========*/

const refreshInterval = 3 * 60 * 1000;

export function* autoRefresh() {
  // start by refreshing immediately
  yield put( refresh(true) );

  // ensure that a refresh happens at least every x minutes
  while(true) {
    let {beenAwhile} = yield race({
      startOver: take(REFRESH),
      beenAwhile: delay(refreshInterval),
    });

    if(beenAwhile && ( yield online() ))
        yield put( refresh(true) );
  }
}
