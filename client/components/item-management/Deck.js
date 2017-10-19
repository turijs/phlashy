import React from 'react';
import {Link} from 'react-router-dom';
import Pressable from '../Pressable';
import renderDate from '../../util/render-date';
import cn from 'classnames';

function Deck({
  id,
  name,
  description,
  created,
  modified,
  cards,
  onMouseDown,
  onClick,
  onPress,
  isSelected
}) {
  let selClass = isSelected ? 'selected' : '';
  return (
    <Link to={`/decks/${id}`}>
      <Pressable
        className={cn('deck', {selected: isSelected})}
        onDown={onMouseDown}
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
Deck.publicProps = [
  {value: 'name', label: 'Name'},
  {value: 'description', label: 'Description'},
  {value: 'size', label: 'Size'},
  {value: 'modified', label: 'Date Modified'},
  {value: 'created', label: 'Date Created'},
]
Deck.filterableProps = ['name'];
Deck.prefix = 'deck';

export default Deck;
