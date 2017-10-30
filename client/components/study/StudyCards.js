import React from 'react';
import {connect} from 'react-redux';
import A from '../A';
import Icon from '../Icon';
import Progress from '../Progress';
import Card from '../item-management/Card';
import Keyboard from '../Keyboard';



class StudyCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isCurFlipped: props.backToFront}
  }

  componentWillReceiveProps(next) {
    if(next.curCard != this.props.curCard)
      this.setState({isCurFlipped: next.backToFront});
  }

  handleFlip = () => this.setState({isCurFlipped: !this.state.isCurFlipped});

  render() {
    let {
      curCard, prevCard, nextCard,
      showNextCard, showPrevCard,
      cardKnown, cardUnknown,
      exit, finishEarly,
      progress, isRevisit,
      backToFront
    } = this.props;

    let cards = [
      generateCard(prevCard, 'prev', backToFront),
      generateCard(curCard, 'curr', this.state.isCurFlipped),
      generateCard(nextCard, 'next', backToFront)
    ]

    return (
      <div className="study-cards">
        <div className="study-nav-top spacious">
          <A className="study-exit" onClick={exit}>Exit</A>
          <Progress percent={progress} />
          <A className="study-finish-early" onClick={finishEarly}>Finish Early</A>
        </div>

        <div className="study-card-wrap grid spacious" onClick={this.handleFlip}>
          {cards}
        </div>

        <div className="study-nav-bottom centered">
          <button tabIndex="2" className="btn-slow"
            onClick={cardUnknown} disabled={isRevisit}>Uh.. no [1]</button>
          <button tabIndex="1" className="btn-go"
            onClick={cardKnown} disabled={isRevisit}>Know it! [2]</button>
        </div>

        <A className="show-prev-card" onClick={showPrevCard} disabled={!prevCard}>
          <Icon slug="chevron-left" />
        </A>
        <A className="show-next-card" onClick={showNextCard} disabled={!isRevisit}>
          <Icon slug="chevron-right" />
        </A>

        <Keyboard shortcuts={{
          'left' : showPrevCard,
          'right': showNextCard,
          'space': this.handleFlip,
          '1'    : cardUnknown,
          '2'    : cardKnown,
        }}/>

      </div>
    )
  }
}




function mapState(state) {
  let {study} = state;
  let sess = study.session;
  let i = sess.curIndex;

  return {
    curCard: sess.cards[i],
    prevCard: sess.cards[i-1],
    nextCard: sess.cards[i+1],
    progress: 100 * sess.numCompleted / sess.cards.length,
    isRevisit: i < sess.numCompleted,
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


function generateCard(card, clss, flipped) {
  return card ? (
    <div className={`card-wrap ${clss}`} key={card.id}>
      <Card {...card} flipped={flipped} />
    </div>
  ) : null;
}
