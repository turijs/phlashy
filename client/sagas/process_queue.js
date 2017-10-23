import { delay } from 'redux-saga';
import { fork, put, select } from 'redux-saga/effects';
import api, { rejectErrors } from '../util/api';
import {sendAction, commitAction, failAction} from './action_handling';

/*
 * Actual queue processing happens here
 */
function* doProcessing() {
  let queue = yield select(state => state.outbound);

  while(queue.length) {
    let action = queue[0];
    yield handleAction(action);
    queue = yield select(state => state.outbound);
  }
}

var queueTask;

/*
 * Only one queue process can happen at a time, no matter how
 * many times processQueue is called. Any calls that happen while
 * the queue is processing receive a promise that is resolved when
 * the queue empties.
 */
export default function* processQueue() {
  if( !queueTask || !queueTask.isRunning() )
    queueTask = yield fork(doProcessing);

  return queueTask.done;
}


const delays = [
  30 * 1000,
  60 * 1000,
  5 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000
];

/*
 * Robustly (hopefully) handle a single outbound action from the queue.
 * Relies on the three helper functions below
 */
function* handleAction(action) {
  retry:
  for(let t of delays) {
    try {
      let res = yield sendAction(action).then(rejectErrors);
      // commit the action!
      return yield commitAction(action, res);
    } catch (e) {
      switch(e.status) {
        case 0: case 401: throw e;
        case 500: break; // repeat after delay
        default: break retry;
      }
    }
    yield delay(t);
  }
  // persist permanently failed
  yield failAction(action);
}
