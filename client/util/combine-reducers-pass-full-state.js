/*
 * Like combineReducers that ships with redux, but passes full state as a
 * third argument to each reducer (also emits no warnings...)
 */
function combineReducers(reducers) {
  let reducerKeys = Object.keys(reducers);
  return function combination(state = {}, action, fullState) {
    fullState = fullState || state;
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action, fullState)
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}

export default combineReducers;
