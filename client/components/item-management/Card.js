import React from 'react';
import {Link} from 'react-router-dom';
import Pressable from '../Pressable';
import Icon from '../Icon';
import renderDate from '../../util/render-date';
import cn from 'classnames';

const updateProps = ['front', 'back', 'created', 'modified', 'flipped', 'selected'];

class Card extends React.Component {
  shouldComponentUpdate(nextProps) {
    for(let prop of updateProps)
      if(nextProps[prop] !== this.props[prop])
        return true;
    return false;
  }
  render() {
    let {
      front, back,
      created, modified,
      onMouseDown, onClick, onPress,
      selected,
      flipped
    } = this.props;

    let selectIcon = <Icon className="card-select" lg slug={selected ? 'check-square-o' : 'square-o'} />

    return (
      <Pressable
        className={cn('card', {selected, flipped})}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onPress={onPress}
      >

        <div className="card-front">
          {selectIcon}
          <div className="card-text-wrap">
            {front}
          </div>
        </div>
        <div className="card-back">
          {selectIcon}
          <div className="card-text-wrap">
            {back}
          </div>
        </div>
        <div className="card-modified">{renderDate(modified)}</div>
        <div className="card-created">{renderDate(created)}</div>
      </Pressable>
    )
  }
}

export default Card;
