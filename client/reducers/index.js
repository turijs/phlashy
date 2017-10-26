import combineReducers from '../util/combine-reducers-pass-full-state';

import user from './user';
import decks from './decks';
import cards from './cards';
import activeView from './active-view';
import study from './study';
import prefs from './prefs';
import offline from './offline';
import hasHydrated from './has-hydrated';
import settingsMeta from './settings-meta';
import outbound from './outbound';
import { routerReducer as router } from 'react-router-redux';

let reducer = combineReducers({
  user,
  decks,
  cards,
  activeView,
  prefs,
  study,
  offline,
  hasHydrated,
  settingsMeta,
  outbound,
  router
});

import {LOGOUT} from '../actions';
import pick from '../util/pick';

/*
 * Automatically restore (most) reducers to default on logout
 */
export default function rootReducer(state, action) {
  if(action.type == LOGOUT)
    return reducer(pick(state, 'offline', 'router'), action);

  return reducer(state, action);
}
