var defaultUser = {
  id: 1,
  nickname: 'bob',
  email: 'bob@bob.com'
}

function user(state = null, action) {
  switch(action.type) {
    case 'LOGIN':
      return {
        id: action.id,
        nickname: action.nickname,
        email: action.email
      };

    case 'UPDATE_USER':
      let newState = {...state};
      if(action.nickname)
        newState.nickname = action.nickname;
      if(action.email)
        newState.email = action.email;
      return newState;

    case 'LOGOUT':
      return null;

    default:
      return state;
  }
}

function decks(state = [], action) {
  switch(action.type) {
    case 'CREATE_DECK':
      return [...state, action.deck];

    default:
      return state;
  }
}

// let decksMetaDefault = {
//
// }
// function decksMeta(state = {}, action) {
//   switch(action.type) {
//     case 'INTENT_CREATE_DECK':
//
//   }
// }

export default {
  user
}
