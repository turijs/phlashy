/*
 *  Queue to store server-bound actions
 */
function outbound(state = [], action) {
  if(action.outbound)
    return [...state, action];
  else if(action.shouldDequeueOutbound)
    return state.slice(1);
  else
    return state;
}

export default outbound;
