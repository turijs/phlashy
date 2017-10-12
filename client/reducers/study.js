import {
  STUDY_INIT, STUDY_BEGIN, STUDY_GO_BACK, STUDY_EXIT,
  NEXT_CARD, PREV_CARD,
  CARD_KNOWN, CARD_UNKNOWN,
} from '../actions';
import { REHYDRATE } from 'redux-persist/constants';


export const stages = {
  CHOOSE_SRC: 'CHOOSE_SRC',
  CHOOSE_OPTS: 'CHOOSE_OPTS',
  STUDY: 'STUDY',
  SHOW_RESULTS: 'SHOW_RESULTS'
}

const defaultStudy = {
  stage: stages.CHOOSE_SRC,
  session: {
    cards: null,
    curIndex: 0,
    highestIndexReached: 0,
    numKnown: 0,
  },
  lastSelectedDecks: [],
}

function study(state = defaultStudy, action, fullState) {
  switch(action.type) {
    case STUDY_INIT: {
      let {decks, cards} = action;
      let newSelection = cards ? 'CUSTOM' : decks;

      let combinedCards = [];
      if(cards)
        combinedCards.push(...cards);
      for(let deckId of decks)
        combinedCards.push(...fullState.decks[deckId].cards);

      return {
        stage: stages.CHOOSE_OPTS,
        session: { ...defaultStudy.session, cards: combinedCards },
        lastSelectedDecks: newSelection,
      }
    }

    case STUDY_BEGIN:
      return {...state, stage: stages.STUDY}

    case STUDY_GO_BACK: {
      if(state.stage == stages.CHOOSE_OPTS)
        return {...state, stage: stages.CHOOSE_SRC}
      else return state;
    }

    case STUDY_EXIT: {
      return {
        ...defaultStudy,
        lastSelectedDecks: state.lastSelectedDecks,
      }
    }

    case REHYDRATE:
      return action.payload.study || state;

    case NEXT_CARD:
    case PREV_CARD:
    case CARD_KNOWN:
    case CARD_UNKNOWN:
      if(state.stage != stages.STUDY)
        return state;
      var {session} = state;
      // continue to next switch
  }
  switch(action.type) {
    case NEXT_CARD:
      if(session.curIndex == session.highestIndexReached) return state;

      return {
        ...state,
        session: {
          ...session,
          curIndex: session.curIndex + 1,
        }
      };

    case PREV_CARD:
      if(session.curIndex == 0) return state;

      return {
        ...state,
        session: {
          ...session,
          curIndex: session.curIndex - 1,
        }
      };

    case CARD_KNOWN: {
      let newSession = {...session, numKnown: session.numKnown + 1};
      let newState = {...state, session: newSession};


      if(session.curIndex == session.cards.length - 1) {
        // at the last card
        newState.stage = stages.SHOW_RESULTS;
      } else {
        newSession.highestIndexReached += 1;
        newSession.curIndex = newSession.highestIndexReached;
      }
      return newState;
    }

    case CARD_UNKNOWN: {
      let newState = {...state};

      if(session.curIndex == session.cards.length - 1) {
        newState.stage = stages.SHOW_RESULTS;
      } else {
        newState.session = {
          ...session,
          highestIndexReached: session.highestIndexReached + 1,
          curIndex: session.highestIndexReached + 1,
        }
      }
      return newState;
    }

    default: return state;
  }
}

export default study;
