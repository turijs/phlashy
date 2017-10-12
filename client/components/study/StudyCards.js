import React from 'react';
import {connect} from 'react-redux';
import A from '../A';
import Icon from '../Icon';
import Progress from '../Progress';
import FlippableCard from './FlippableCard';
import Card from '../item-management/Card';

function StudyCards({
  curCard, prevCard, nextCard,
  showNextCard, showPrevCard,
  cardKnown, cardUnknown,
  exit, finishEarly,
  progress, isRevisit,
  backToFront
}) {
  let cards = [
    generateCard(prevCard, 'prev', backToFront),
    generateCard(curCard, 'curr', backToFront),
    generateCard(nextCard, 'next', backToFront)
  ]

  return (
    <div className="study-cards">
      <div className="study-nav-top">
        <A className="study-exit" onClick={exit}>Exit</A>
        <Progress percent={progress} />
        <A className="study-finish-early" onClick={finishEarly}>Finish Early</A>
      </div>

      <div className="study-card-wrap grid spacious">
        {cards}
      </div>

      <div className="study-nav-bottom">
        <button tabIndex="2" className="btn-slow" onClick={cardUnknown}>Uhh.. no</button>
        <button tabIndex="1" className="btn-go" onClick={cardKnown}>Know it</button>
      </div>

      <A className="show-prev-card" onClick={showPrevCard} disabled={!prevCard}>
        <Icon slug="chevron-left" />
      </A>
      <A className="show-next-card" onClick={showNextCard} disabled={!isRevisit}>
        <Icon slug="chevron-right" />
      </A>
    </div>
  )
}




function mapState(state) {
  let {study, cards} = state;
  let sess = study.session;
  let i = sess.curIndex;

  return {
    curCard: cards[ sess.cards[i] ],
    prevCard: sess.cards[i-1] && cards[ sess.cards[i-1] ],
    nextCard: sess.cards[i+1] && cards[ sess.cards[i+1] ],
    progress: sess.highestIndexReached / sess.cards.length,
    isRevisit: i < sess.highestIndexReached,
    backToFront: state.prefs.study.backToFront
  }
}

import {
  nextCard, prevCard,
  cardKnown, cardUnknown,
  studyExit, studyFinishEarly,
} from '../../actions';

const mapDispatch =  {
  showNextCard: nextCard,
  showPrevCard: prevCard,
  cardKnown, cardUnknown,
  exit: studyExit,
  finishEarly: studyFinishEarly,
}

export default connect(mapState, mapDispatch)(StudyCards);


function generateCard(card, clss, initFlipped) {
  return card ? (
    <FlippableCard
      {...card}
      key={card.id}
      className={clss}
      initFlipped={initFlipped}
    />
  ) : null;
}
