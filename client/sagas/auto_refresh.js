import { put, race, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { CONNECTION_GAINED, REFRESH_SUCCEEDED, refresh } from '../actions';
import { online } from './util';

const refreshInterval = 600 * 1000

export default function* autoRefresh() {
  // start by refreshing immediately
  yield put( refresh(true) );

  while(true) {
    let {beenAwhile, cameOnline} = yield race({
      startOver: take(REFRESH_SUCCEEDED),
      beenAwhile: delay(refreshInterval),
      cameOnline: take(CONNECTION_GAINED)
    });

    if(beenAwhile || cameOnline)
      if( yield online() ) {
        yield put( refresh(true) );
      }

  }
}
