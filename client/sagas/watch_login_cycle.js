import { all, call, fork, put, race, take } from 'redux-saga/effects';
import { LOGIN, LOGOUT, logout } from '../actions';
import { REHYDRATE } from 'redux-persist/constants';
import api from '../util/api';

import watchRefresh from './watch_refresh';
import autoRefresh from './auto_refresh';
import watchOutbound from './watch_outbound';

function* subTasks() {
  yield fork(watchRefresh);
  yield fork(autoRefresh);
  yield fork(watchOutbound);
}

export default function* watchLoginCycle() {
  while(true) {
    let { willRehydrate } = yield take(LOGIN);

    // wait for rehydration if necessary
    if(willRehydrate)
      yield take(REHYDRATE);

    try {
      yield race({
        1: call(subTasks),
        2: take(LOGOUT)
      });
      yield api.post('/logout');
    } catch (e) {
      if(e == 'LOGGED_OUT')
        yield put( logout() );
      else throw e;
    }
  }
}
