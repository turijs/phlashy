import {take} from 'redux-saga/effects';
import {sendAction, commitAction, failAction} from './action_handling';
import {rejectErrors} from '../util/api';
import {catchOffline, offline} from './util';

export default function* watchSync() {
  while(true) {
    let action = yield take(a => a.sync);

    console.log(action);

    // ignore when offline
    if( yield offline() ) continue;

    try {
      let res = yield sendAction(action);
      yield commitAction(action, res);
    } catch (e) {
      if(e.status == 401) throw e;

      yield failAction(action, e);
      catchOffline(e);
    }


  }
}
