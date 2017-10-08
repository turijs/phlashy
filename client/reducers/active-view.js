import {
  SELECT, DESELECT, TOGGLE_SELECTING,
  SET_FILTER, CLEAR_FILTER,
  BEGIN_EDIT, CANCEL_EDIT,
  FLIP_CARDS,
} from '../actions';

const defaultActiveView = {
  selected: [],
  flipped: {},
  filter: '',
  isSelecting: false,
}

function activeView(state = defaultActiveView, action) {
  switch(action.type) {
    case SELECT:
      return {...state, selected: action.items, isSelecting: true};

    case DESELECT:
      return {...state, selected: [], isSelecting: false};

    case TOGGLE_SELECTING:
      return {...state, selected: [], isSelecting: !state.isSelecting};

    case SET_FILTER:
      return {...state, filter: action.filter};

    case CLEAR_FILTER:
      return {...state, filter: ''};

    case FLIP_CARDS: {
      let newFlipped = {...state.flipped};
      for(let id of action.ids)
        newFlipped[id] = !newFlipped[id];
      return {...state, flipped: newFlipped}
    }

    default:
      return state;
  }
}

export default activeView;
