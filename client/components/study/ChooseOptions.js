import React from 'react';
import Check from '../Check';

function ChooseOptions({
  shuffle, flip,
  toggleShuffle, toggleFlip,
  onNext, onBack,
}) {
  return (
    <div className="choose-opts">
      <h2>Choose Study Options</h2>
      <div className="spacious container-narrow">
        <Check on={shuffle} onClick={toggleShuffle}/> &nbsp; Shuffle Cards
      </div>
      <div className="spacious container-narrow">
        <Check on={flip} onClick={toggleFlip}/> &nbsp; Flip Cards
      </div>

      <div className="study-nav-bottom">
        <button onClick={onNext} className="right">
          Next
        </button>

        <button onClick={onBack}>
          Back
        </button>
      </div>

    </div>
  );
}

export default ChooseOptions;
