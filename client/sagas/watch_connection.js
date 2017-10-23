import { put, race, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from '../util/api';
import { CONNECTION_LOST, REFRESH, connectionGained } from '../actions';

const pingInterval = 30 * 1000;

export default function* watchConnection() {
  while(true) {
    yield take(CONNECTION_LOST);

    // periodically check connection
    while(true) {
      yield race({
        // user refresh causes a check to happen immediately
        refresh: take( REFRESH ),
        delay: delay(pingInterval)
      });
      try {
        yield api.head('/ping');
        yield put( connectionGained() );
        break;
      } catch (e) { continue } // still offline...
    }
  }
}
