import { put, select } from 'redux-saga/effects';

export function* offline() {
  return yield select(state => state.offline);
}

export function* online() {
  return !( yield select(state => state.offline) );
}

import { connectionLost } from '../actions';

export function* catchOffline(e) {
  if(e && e != 'FETCH_FAILED')
    throw e;
  yield put( connectionLost() );
}