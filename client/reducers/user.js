import {LOGIN, LOGOUT, UPDATE_USER} from '../actions';

function user(state = null, action) {
  switch(action.type) {
    case LOGIN:
    case UPDATE_USER:
      return {...state, ...action.userData};

    case LOGOUT:
      return null;

    default:
      return state;
  }
}

export default user;
