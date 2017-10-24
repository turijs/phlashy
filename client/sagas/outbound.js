import { fork, take } from 'redux-saga/effects';
import { online, catchOffline } from './util';
import queue from './queue';
import handleAction from './action-handling';

export default function* watchOutbound() {
  while(true) {
    let action = yield take(action => action.outbound);
    yield fork(handleOutbound, action);
  }
}

function* handleOutbound(action) {
  try {
    if(action.outbound.sync)
      yield handleAction(action);
    else if( (yield online()) && !queue.isProcessing)
      yield queue.process();
  } catch(e) {
    if(e.status == 401) throw e;
    if( ! (yield catchOffline(e)) )
      console.log(e);
  }
}
