import { all } from 'redux-saga/effects';
import watchLoginCycle from './login-cycle';
import watchConnection from './connection';

export default function* rootSaga() {
  yield all([
    watchLoginCycle(),
    watchConnection()
  ]);
}
