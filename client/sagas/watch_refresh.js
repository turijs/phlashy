import {all, put, take} from 'redux-saga/effects';
import api, {toJSON} from '../util/api';
import { REFRESH, refresh_succeeded, refresh_failed } from '../actions';
import { offline, catchOffline } from './util';
import processQueue from './process_queue';

export default function* watchRefresh() {
  while(true) {
    yield take(REFRESH);

    if( yield offline() )
      continue;

    try {
      // process the outbound queue before pulling data from the server
      yield processQueue();

      let {cards, decks} = yield all({
        decks: api.get('/decks').then(toJSON)
      });
      yield put( refresh_succeeded(decks) );
    } catch (e) {
      yield put( refresh_failed() );
      switch(e) {
        case 'SERVER_ERROR': break;
        case 'FETCH_FAILED': yield catchOffline(); break;
        default: throw e;
      }
    }
  }
}
