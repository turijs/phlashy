import { LOGIN, UPDATE_NICKNAME_COMMIT, UPDATE_EMAIL_COMMIT } from '../actions';

function user(state = null, action) {
  switch(action.type) {
    case LOGIN:
      return {...state, ...action.userData};

    case UPDATE_NICKNAME_COMMIT:
      return {...state, nickname: action.value};

    case UPDATE_EMAIL_COMMIT:
      return {...state, email: action.value};

    default: return state;
  }
}

export default user;
