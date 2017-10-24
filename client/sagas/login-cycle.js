import { all, call, fork, put, race, take } from 'redux-saga/effects';
import { LOGIN, LOGOUT, SKIP_REHYDRATION, logout } from '../actions';
import { REHYDRATE } from 'redux-persist/constants';
import api from '../util/api';
import watchRefresh, {autoRefresh} from './refresh';
import watchOutbound from './outbound';

function* subTasks() {
  yield fork(autoRefresh);
  yield fork(watchRefresh);
  yield fork(watchOutbound);
}

export default function* watchLoginCycle() {
  while(true) {
    // wait for a login, or if already logged-in,
    // wait for rehydration stage to complete
    yield take([LOGIN, REHYDRATE, SKIP_REHYDRATION]);

    try {
      yield race({
        1: call(subTasks),
        2: take(LOGOUT)
      });
      yield api.post('/logout');
    } catch (e) {
      if(e.status == 401)
        yield put( logout() );
      else console.log(e);
    }
  }
}
