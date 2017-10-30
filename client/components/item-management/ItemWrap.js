import React from 'react';
import kbs from '../../util/keyboard_shortcuts';

class ItemWrap extends React.Component {
  handleBgClick = e => {
    if( e.target.getAttribute('data-deselect') )
      this.props.stopSelecting();
  }

  render() {
    return (
      <div className="item-wrap" onClick={this.handleBgClick} data-deselect>
        {this.props.children}
      </div>
    )
  }
}

export default ItemWrap;
