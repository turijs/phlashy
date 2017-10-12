import React from 'react';
import Card from '../item-management/Card';

class FlippableCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flipped: props.initFlipped }
  }

  render() {
    let { className, initFlipped, ...rest} = this.props;
    let {flipped} = this.state;
    return (
      <div className={`flippable-card ${className}`}>
        <Card
          {...rest}
          isFlipped={flipped}
          onClick={() => this.setState({flipped: !flipped})}
        />
      </div>
    )
  }
}

export default FlippableCard;
