import React from 'react';
import {connect} from 'react-redux';
import Check from '../Check';

function ChooseOptions({
  shuffle, flip,
  toggleShuffle, toggleFlip,
  onNext, onBack,
}) {
  return (
    <div className="choose-opts">
      <h2>Choose Study Options</h2>

      <div className="container-twig">
        <div className="spacious">
          <Check on={shuffle} onClick={toggleShuffle}/> &nbsp; Shuffle Cards
        </div>
        <div className="spacious">
          <Check on={flip} onClick={toggleFlip}/> &nbsp; Flip Cards
        </div>
      </div>


      <div className="study-nav-bottom">
        <button onClick={onNext} className="right btn-go">
          Begin
        </button>

        <button onClick={onBack}>
          Back
        </button>
      </div>

    </div>
  );
}


import {studyBegin, studyGoBack, toggleShuffle, toggleFrontBack} from '../../actions';

export default connect(
  state => ({
    shuffle: state.prefs.study.shuffle,
    flip: state.prefs.study.backToFront
  }),
  {
    onNext: studyBegin,
    onBack: studyGoBack,
    toggleShuffle,
    toggleFlip: toggleFrontBack
  }
)(ChooseOptions);
