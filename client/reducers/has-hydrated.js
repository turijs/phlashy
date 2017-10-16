import { REHYDRATE } from 'redux-persist/constants';
import { REFRESH_SUCCEEDED } from '../actions';

function hasHydrated(state = false, action) {
  switch(action.type) {
    case REHYDRATE:
    case REFRESH_SUCCEEDED: return true;
    default: return state;
  }
}

export default hasHydrated;
