import {
  STUDY_INIT, STUDY_BEGIN, STUDY_GO_BACK, STUDY_EXIT,
  NEXT_CARD, PREV_CARD,
  CARD_KNOWN, CARD_UNKNOWN,
  ADD_DECK_COMMIT, ADD_CARD_COMMIT,
} from '../actions';
import { REHYDRATE } from 'redux-persist/constants';

import shuffle from '../util/shuffle';


export const stages = {
  CHOOSE_SRC: 'CHOOSE_SRC',
  CHOOSE_OPTS: 'CHOOSE_OPTS',
  STUDY: 'STUDY',
  SHOW_RESULTS: 'SHOW_RESULTS'
}

const defaultStudy = {
  stage: stages.CHOOSE_SRC,
  session: {
    cards: [],
    curIndex: 0,
    numCompleted: 0,
    unknown: [],
  },
  source: {
    cards: [],
    decks: []
  },
}

function study(state = defaultStudy, action, fullState) {
  switch(action.type) {
    case STUDY_INIT: {
      let source = action.source || state.source;

      return {
        stage: stages.CHOOSE_OPTS,
        session: defaultStudy.session,
        source,
      }
    }

    case STUDY_BEGIN: {
      let {cards, decks} = state.source;
      let fullCards = [];

      if(cards) {
        for(let cardId of cards) {
          let fullCard = fullState.cards[cardId];
          if(fullCard)
            fullCards.push(fullCard);
        }
      }

      if(decks) {
        for(let deckId of decks) {
          let fullDeck = fullState.decks[deckId];
          if(fullDeck)
            fullCards.push(...fullDeck.cards.map(id => fullState.cards[id]))
        }
      }


      if(fullState.prefs.study.shuffle)
        shuffle(fullCards)

      return {
        ...state,
        session: {...defaultStudy.session, cards: fullCards},
        stage: stages.STUDY
      };
    }

    case STUDY_GO_BACK: {
      if(state.stage == stages.CHOOSE_OPTS)
        return {...state, stage: stages.CHOOSE_SRC}
      else return state;
    }

    case STUDY_EXIT: {
      return {
        ...defaultStudy,
        source: state.source,
      }
    }

    case NEXT_CARD:
    case PREV_CARD:
    case CARD_KNOWN:
    case CARD_UNKNOWN:
      return shiftCard(state, action);

    case REHYDRATE:
      return action.payload.study || state;

    case ADD_DECK_COMMIT:
      return {...state, source: {
        ...state.source,
        decks: state.source.decks.map(id => id === action.tempId ? action.id : id)
      }};

    case ADD_CARD_COMMIT:
      return {...state, source: {
        ...state.source,
        cards: state.source.cards.map(id => id === action.tempId ? action.id : id)
      }};


    default: return state;
  }
}


export default study;

/*======= Reducer helpers ========*/

function shiftCard(state, action) {
  if(state.stage != stages.STUDY)
    return state;

  let {session} = state;

  switch(action.type) {
    case NEXT_CARD:
      if(session.curIndex == session.numCompleted) return state;

      return {
        ...state,
        session: { ...session, curIndex: session.curIndex + 1, }
      };

    case PREV_CARD:
      if(session.curIndex == 0) return state;

      return {
        ...state,
        session: { ...session, curIndex: session.curIndex - 1, }
      };

    case CARD_KNOWN:
    case CARD_UNKNOWN:
      return completeCard(state, action)
  }
}

function completeCard(state, action) {
  let {session} = state;

  // ignore these actions user is revisiting a completed card
  if(session.curIndex != session.numCompleted) return state;

  let newSession = {...session, numCompleted: session.numCompleted + 1};
  let newState = {...state, session: newSession};

  if(action.type == CARD_UNKNOWN)
    newSession.unknown = session.unknown.concat(session.cards[session.curIndex].id);

  if(newSession.numCompleted == session.cards.length) // at the last card
    newState.stage = stages.SHOW_RESULTS;
  else
    newSession.curIndex++;

  return newState;
}
