import { fork, select } from 'redux-saga/effects';
import handleAction from './action-handling';

var queueTask = false;

const queue = {
  /*
   * Only one queue process can happen at a time, no matter how
   * many times queue.process is called. Any calls that happen while
   * the queue is processing receive a promise that is resolved when
   * the queue empties.
   */
  * process() {
    if( !queue.isProcessing )
      queueTask = yield fork(doProcessing);

    return queueTask.done;
  },

  get isProcessing() {
    return queueTask && queueTask.isRunning();
  }
}

export default queue;

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
