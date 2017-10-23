import { combineReducers } from 'redux';
import makeSyncTracker from './factories/make-sync-tracker';
import {
  LOGIN, LOGOUT,
  UPDATE_NICKNAME, UPDATE_EMAIL, UPDATE_PASSWORD
} from '../actions';

export default combineReducers({
  nickname: makeSyncTracker(UPDATE_NICKNAME),
  email: makeSyncTracker(UPDATE_EMAIL),
  password: makeSyncTracker(UPDATE_PASSWORD),
});
