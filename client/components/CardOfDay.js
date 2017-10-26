import React from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Card from './item-management/Card';

class CardOfDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {flipped: false};
  }

  render() {
    let {card} = this.props;
    let {flipped} = this.state;
    return (
      <div className="card-of-day">
        <h2>Your Card of the Day</h2>

        {card ? (
          <div className="grid">
            <Card
              {...card}
              isFlipped={flipped}
              onClick={() => this.setState({flipped: !flipped})}
            />
          </div>
        ) : (
          <p>You don't have any cards. Head on over to the <Link to="/decks">Decks</Link> tab to get started.</p>
        )}

      </div>
    );
  }
}

import {getCardOfDay} from '../selectors';

export default connect(
  state => ({ card: getCardOfDay(state) })
)(CardOfDay)
