import React from 'react';
import { connect } from 'react-redux';
import { stages } from '../reducers/study';
import ChooseSource from './study/ChooseSource';
import ChooseOptions from './study/ChooseOptions';
import StudyCards from './study/StudyCards';
import Results from './study/Results';

function Study({ stage }) {
  let comp;
  switch(stage) {
    case stages.CHOOSE_SRC:
      comp = <ChooseSource />;
      break;
    case stages.CHOOSE_OPTS:
      comp = <ChooseOptions />
      break;
    case stages.STUDY:
      comp = <StudyCards />;
      break;
    case stages.SHOW_RESULTS:
      comp = <Results />;
  }
  return (
    <div id="study">
      <h1>Study</h1>
      {comp}
    </div>
  )
}


export default connect(
  state => ({stage: state.study.stage})
)(Study);
