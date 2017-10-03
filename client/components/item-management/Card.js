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
  isSelected,
  isFlipped
}) {
  return (
      <Pressable
        className={cn('card', {selected: isSelected, flipped: isFlipped})}
        onDown={onMouseDown}
        onClick={onClick}
        onPress={onPress}
        pressDelay={600}
      >
        <div className="card-front">
          <div className="card-text-wrap">
            {front}
          </div>
        </div>
        <div className="card-back">
          <div className="card-text-wrap">
            {back}
          </div>
        </div>
        <div className="card-modified">{renderDate(modified)}</div>
        <div className="card-created">{renderDate(created)}</div>
      </Pressable>
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
