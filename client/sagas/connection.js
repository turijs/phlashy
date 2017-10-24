import { put, race, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from '../util/api';
import { CONNECTION_LOST, CONNECTION_GAINED, connectionGained, refresh } from '../actions';

const pingInterval = 20 * 1000;

export default function* watchConnection() {
  while(true) {
    yield take(CONNECTION_LOST);

    // periodically check connection
    while(true) {
      let {stop} = yield race({
        ping: delay(pingInterval),
        stop: take(CONNECTION_GAINED),
      });

      if(stop) break;

      if( yield tryReconnect() ) {
        yield put( refresh(true) );
        break;
      }
    }
  }
}

export function* tryReconnect() {
  try {
    yield api.head('/ping');
    yield put( connectionGained() );
    return true;
  } catch (e) {
    return false; // still offline...
  }
}
