import React from 'react';
import {Link} from 'react-router-dom';
import Pressable from '../Pressable';
import renderDate from '../../util/render-date';
import cn from 'classnames';

function Card({
  id,
  front,
  back,
  created,
  modified,
  onMouseDown,
  onClick,
  onPress,
  isSelected
}) {
  return (
    <Link to={`/decks/${id}`}>
      <Pressable
        className={cn('card', {selected: isSelected})}
        onDown={onMouseDown}
        onClick={onClick}
        onPress={onPress}
        pressDelay={600}
      >
        <div className="card-front">{name}</div>
        <div className="card-back">{description}</div>
        <div className="card-modified">{renderDate(modified)}</div>
        <div className="card-created">{renderDate(created)}</div>
      </Pressable>
    </Link>
  )
}
Card.publicProps = [
  {value: 'front', label: 'Front'},
  {value: 'back', label: 'Back'},
  {value: 'modified', label: 'Date Modified'},
  {value: 'created', label: 'Date Created'},
]
Card.filterableProps = ['front', 'back'];
Card.prefix = 'card';

export default Card;
