import { take } from 'redux-saga/effects';
import { online, catchOffline } from './util';
import processQueue from './process_queue';

export default function* watchOutbound() {
  while(true) {
    let action = yield take(action => action.outbound);
    // if we are online, process the queue immediately
    if( yield online() ) {
      try {
        yield processQueue();
      } catch(e) {
        if( ! (yield catchOffline(e)) ) throw e;
      }
    }
  }
}
