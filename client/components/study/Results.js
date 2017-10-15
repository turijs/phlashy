import React from 'react';
import {connect} from 'react-redux';
import Progress from '../Progress';

function Results({
  knownCount,
  cardCount,
  repeatAll,
  repeatUnknown,
  exit,
}) {
  let percent = Math.floor(100 * knownCount / cardCount);

  return (
    <div className="study-results">
      <div className="spacious">
        You knew {knownCount}/{cardCount} cards ({percent}%).
        {percent > 95 && ' Great Job!'}
        <br /><br />
        <Progress percent={percent} thick animateOnMount />
      </div>

      <div className="study-nav-bottom centered">
        <button onClick={repeatAll}>Repeat All Cards</button>
        <button onClick={repeatUnknown}>Repeat The Cards I Didn't Know</button>
        <button onClick={exit} className="btn-dark">Done</button>
      </div>


    </div>
  )
}

import { studyInit, studyExit } from '../../actions';

export default connect(
  ({study: {session}}) => ({
    cardCount: session.cards.length,
    knownCount: session.cards.length - session.unknown.length,
    unknown: session.unknown,
  }),
  null,
  ({unknown, ...props}, {dispatch}, ownProps) => {
    return {
      ...ownProps,
      ...props,
      repeatAll: () => dispatch( studyInit() ),
      repeatUnknown: () => dispatch( studyInit({cards: unknown}) ),
      exit: () => dispatch( studyExit() )
    };
  }
)(Results);
