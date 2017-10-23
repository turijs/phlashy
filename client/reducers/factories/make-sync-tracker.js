const defaultStatus = {
  waiting: false,
  error: false,
}

export default function makeSyncTracker(main, commit, failed) {
  commit = commit || main + '_COMMIT';
  failed = failed || main + '_FAILED';
  
  return function(state = defaultStatus, action) {
    switch(action.type) {
      case main:
        return {waiting: true, error: false};
      case commit:
        return defaultStatus;
      case failed:
        return {waiting: false, error: action.error}
      default: return state;
    }
  }
}

// const defaultFieldState = {
//   editing: false,
//   saving: false,
//   saved: false,
//   error: false
// }
//
// const defaultSyncStatus = {
//   nickname: defaultFieldState,
//   email: defaultFieldState,
//   password: defaultFieldState
// }
//
// function userFields(state = defaultUserFields, action) {
//   switch(action.type) {
//     case BEGIN_USER_EDIT:
//       return {
//         ...state,
//         [action.field]: {...defaultFieldState, editing: true }
//       }
//     case UPDATE_USER:
//       return {
//         ...state,
//         [action.field]: {...state[action.field], saving: true }
//       }
//     case UPDATE_USER_COMMIT:
//       return {
//         ...state,
//         [action.field]: {...defaultFieldState, saved: true }
//       }
//     case UPDATE_USER_FAILED:
//       return {
//         ...state,
//         [action.field]: {...state[action.field], saving: false, error: action.error }
//       }
//
//   }
// }
//
// export default combineReducers({
//   userFields
// });
