import React from 'react';
import DeckPicker from '../item-management/DeckPicker';

class ChooseSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chosen: props.chosen};
  }

  render() {
    let {decks, onNext} = this.props;
    let {chosen} = this.state;

    return (
      <div className="choose-src">
        <h2>Choose decks to study</h2>
        <div className="container-med">
          <DeckPicker
            className="spacious"
            decks={decks}
            picked={chosen}
            onPick={(chosen) => this.setState({ chosen })}
          />
        </div>


        <div className="study-nav-bottom">
          <button onClick={()=>onNext(chosen)}
            disabled={!chosen.length} className="right">
            Next
          </button>
        </div>

      </div>
    )
  }
}

export default ChooseSource;
