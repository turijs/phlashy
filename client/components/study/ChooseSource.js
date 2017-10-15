import React from 'react';
import {connect} from 'react-redux';
import DeckPicker from '../item-management/DeckPicker';

class ChooseSource extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chosen: props.source.decks || [],
      useCustomSelection: !!props.source.cards,
    };
  }

  handleNext = () => {
    if(this.state.useCustomSelection)
      this.props.studyInit();
    else
      this.props.studyInit({decks: this.state.chosen})
  }

  render() {
    let {decks, onNext, source} = this.props;
    let {chosen, useCustomSelection} = this.state;

    return (
      <div className="choose-src">
        <h2>Choose decks to study</h2>

        <div className="container-med spacious">
          {useCustomSelection ? (
            <div style={{textAlign: 'center'}}>
              You currently have a custom selection of cards. <br />
              <button onClick={() => this.setState({useCustomSelection: false})}>
                Select Decks Instead
              </button>
            </div>
          ) : (
            <DeckPicker
              decks={decks}
              picked={chosen}
              onPick={(chosen) => this.setState({ chosen })}
            />
          )}
        </div>

        <div className="study-nav-bottom">
          <button onClick={this.handleNext}
            disabled={!(chosen.length || useCustomSelection)} className="right">
            Next
          </button>
        </div>

      </div>
    )
  }
}



import {studyInit} from '../../actions';

export default connect(
  state => ({
    decks: Object.values(state.decks),
    source: state.study.source
  }),
  { studyInit }
)(ChooseSource);
