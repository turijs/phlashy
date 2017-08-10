import { all, call, put, take } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import api from './util/api';


function* watchLogout() {
  while(true) {
    yield take('LOGOUT_REQUESTED');
    try {
      let res = yield call(api.post, '/logout');
      if(res.ok)
        yield put({type: 'LOGOUT'})
      else
        yield put({type: 'LOGOUT_FAILED'})
    } catch (e) {
      console.log(e);
    } finally {

    }

  }
}

function* log() {
  while(true) {
    console.log(yield take('*'));
  }
}

function* rootSaga() {
  yield all([
    log(),
    watchLogout()
  ]);
}

export default rootSaga;
