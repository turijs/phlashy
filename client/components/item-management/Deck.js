import React from 'react';
import {Link} from 'react-router-dom';
import Pressable from '../Pressable';
import renderDate from '../../util/render-date';
import cn from 'classnames';
import slugify from '../../util/slugify';

const updateProps = ['name', 'description', 'created', 'modified', 'cards', 'selected'];

class Deck extends React.Component {
  shouldComponentUpdate(nextProps) {
    for(let prop of updateProps)
      if(nextProps[prop] !== this.props[prop])
        return true;
    return false;
  }
  render() {
    let {
      id,
      name, description,
      created, modified,
      cards,
      onMouseDown, onClick, onPress,
      selected
    } = this.props;
    return (
      <Link to={`/decks/${id}-${slugify(name)}`} className="deck-link">
        <Pressable
          className={cn('deck', {selected})}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onPress={onPress}
        >
          <div className="deck-name">{name}</div>
          <div className="deck-description">{description}</div>
          <div className="deck-size">{cards.length}</div>

          <div className="deck-modified">{renderDate(modified)}</div>
          <div className="deck-created">{renderDate(created)}</div>
        </Pressable>
      </Link>
    )
  }
}

export default Deck;
