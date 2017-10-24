import { put, select } from 'redux-saga/effects';

export function* offline() {
  return yield select(state => state.offline);
}

export function* online() {
  return !( yield select(state => state.offline) );
}

import { connectionLost } from '../actions';

export function* catchOffline(e) {
  if(e.status === 0) {
    if( yield online() )
      yield put( connectionLost() );
    return true;
  }
  return false;
}
