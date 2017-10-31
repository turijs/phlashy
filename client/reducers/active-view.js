import {
  SELECT, DESELECT, SELECT_ALL, SELECT_NONE,
  TOGGLE_SELECTING, STOP_SELECTING,
  SET_FILTER, CLEAR_FILTER,
  FLIP,
  BEGIN_ACTIVITY, END_ACTIVITY,
  ADD_DECK_COMMIT, ADD_CARD_COMMIT
} from '../actions';
import {getActiveFilteredIds} from '../selectors';

const defaultActiveView = {
  selected: {},
  flipped: {},
  filter: '',
  isSelecting: false,
  activity: null,
}

function activeView(state = defaultActiveView, action, fullState) {
  switch(action.type) {
    case SELECT:
      return {...state, selected: {...state.selected, [action.id]: true}, isSelecting: true};

    case SELECT_ALL: {
      let ids = getActiveFilteredIds(fullState);
      let newSelected = {...state.selected};
      for(let id of ids)
        newSelected[id] = true;
      return {...state, selected: newSelected, isSelecting: true};
    }

    case DESELECT:
      return {...state, selected: {...state.selected, [action.id]: false} };

    case SELECT_NONE:
      return {...state, selected: {}}

    case TOGGLE_SELECTING:
      return {...state, selected: {}, isSelecting: !state.isSelecting};

    case STOP_SELECTING:
      return {...state, selected: {}, isSelecting: false}


    case FLIP: {
      let newFlipped = {...state.flipped};
      for(let id of action.ids)
        newFlipped[id] = !newFlipped[id];
      return {...state, flipped: newFlipped}
    }


    case SET_FILTER:
      return {...state, filter: action.filter};

    case CLEAR_FILTER:
      return {...state, filter: ''};
      

    case BEGIN_ACTIVITY:
      return {...state, activity: action.name}

    case END_ACTIVITY:
      return {...state, activity: null}


    // resolve IDs
    case ADD_DECK_COMMIT:
    case ADD_CARD_COMMIT: {
      let {flipped, selected} = state;
      let newSelected = selected[action.tempId] ?
        {...selected, [action.tempId]: false, [action.id]: true} : selected;
      let newFlipped = flipped[action.tempId] ?
        {...flipped, [action.tempId]: false, [action.id]: true} : flipped;
      return {...state, flipped: newFlipped, selected: newSelected};
    }

    default:
      return state;
  }
}

export default activeView;
