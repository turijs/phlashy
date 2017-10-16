import combineReducers from '../util/combine-reducers-pass-full-state';

import user from './user';
import decks from './decks';
import cards from './cards';
import activeView from './active-view';
import study from './study';
import prefs from './prefs';
import offline from './offline';
import hasHydrated from './has-hydrated';
import outbound from './outbound';
import { routerReducer as router } from 'react-router-redux';

export default combineReducers({
  user,
  decks,
  cards,
  activeView,
  prefs,
  study,
  offline,
  hasHydrated,
  outbound,
  router
});
