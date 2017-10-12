import React from 'react';
import { connect } from 'react-redux';
import { stages } from '../reducers/study';
import ChooseSource from './study/ChooseSource';
import ChooseOptions from './study/ChooseOptions';
import StudyCards from './study/StudyCards';

function Study({
  stage,
  selected,
  decks,
  nextCard, prevCard, cardKnown, cardUnknown,
  studyInit, studyBegin, studyGoBack, studyExit,
  shuffle, toggleShuffle,
  backToFront, toggleFrontBack,
}) {
  let comp;
  switch(stage) {
    case stages.CHOOSE_SRC: comp =
      <ChooseSource
        decks={decks}
        chosen={selected}
        onNext={(chosen) => studyInit({decks: chosen})}
      />;
      break;
    case stages.CHOOSE_OPTS: comp =
      <ChooseOptions
        shuffle={shuffle}
        toggleShuffle={toggleShuffle}
        flip={backToFront}
        toggleFlip={toggleFrontBack}
        onNext={studyBegin}
        onBack={studyGoBack}
      />
      break;
    case stages.STUDY:
      comp = <StudyCards />;
      break;
    case stages.SHOW_RESULTS:

  }
  return (
    <div id="study">
      <h1>Study</h1>
      {comp}
    </div>
  )
}

function mapState(state) {
  let {study} = state;
  return {
    stage: study.stage,
    selected: study.lastSelectedDecks,
    decks: Object.values(state.decks),
    shuffle: state.prefs.study.shuffle,
    backToFront: state.prefs.study.backToFront,
  }
}

import {
  nextCard, prevCard, cardKnown, cardUnknown,
  studyInit, studyBegin, studyGoBack, studyExit,
  toggleShuffle, toggleFrontBack
} from '../actions';

const mapDispatch = {
  nextCard, prevCard, cardKnown, cardUnknown,
  studyInit, studyBegin, studyGoBack, studyExit,
  toggleShuffle, toggleFrontBack,
}

export default connect(mapState, mapDispatch)(Study);
