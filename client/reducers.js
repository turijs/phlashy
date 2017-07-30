var defaultUser = {
  id: 1,
  nickname: 'bob',
  email: 'bob@bob.com'
}

function user(state = null, action) {
  switch(action.type) {
    case 'UPDATE_USER':
      let newState = {...state};
      if(action.nickname)
        newState.nickname = action.nickname;
      if(action.email)
        newState.email = action.email;
      return newState;

    case 'LOGIN':
      return {
        id: action.id,
        nickname: action.nickname,
        email: action.email
      }
      
    default:
      return state;
  }
}

export default {
  user
}
