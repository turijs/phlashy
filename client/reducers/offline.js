import {CONNECTION_LOST, CONNECTION_GAINED} from '../actions';

function offline(state = false, action) {
  switch(action.type) {
    case CONNECTION_LOST: return true;
    case CONNECTION_GAINED: return false;
    default: return state;
  }
}

export default offline;
