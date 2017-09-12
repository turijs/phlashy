import { all } from 'redux-saga/effects';
import watchLoginCycle from './watch_login_cycle';
import watchConnection from './watch_connection';

export default function* rootSaga() {
  yield all([
    watchLoginCycle(),
    watchConnection()
  ]);
}
