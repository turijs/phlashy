import React from 'react';
import {Link} from 'react-router-dom';
import Pressable from '../Pressable';
import renderDate from '../../util/render-date';
import cn from 'classnames';
import slugify from '../../util/slugify';

class Deck extends React.PureComponent {
  render() {
    let {
      id,
      name,
      description,
      created,
      modified,
      cards,
      onMouseDown,
      onClick,
      onPress,
      selected
    } = this.props;
    let item = {id, selected};

    // console.log('deck render');

    return (
      <Link to={`/decks/${id}-${slugify(name)}`}>
        <Pressable
          className={cn('deck', {selected})}
          onDown={e => onMouseDown(e, item)}
          onClick={e => onClick(e, item)}
          onPress={e => onPress(e, item)}
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
// function Deck({
//   id,
//   name,
//   description,
//   created,
//   modified,
//   cards,
//   onMouseDown,
//   onClick,
//   onPress,
//   selected
// }) {
//   console.log('deck render');
//   return (
//     <Link to={`/decks/${id}-${slugify(name)}`}>
//       <Pressable
//         className={cn('deck', {selected})}
//         onDown={onMouseDown}
//         onClick={onClick}
//         onPress={onPress}
//       >
//         <div className="deck-name">{name}</div>
//         <div className="deck-description">{description}</div>
//         <div className="deck-size">{cards.length}</div>
//
//         <div className="deck-modified">{renderDate(modified)}</div>
//         <div className="deck-created">{renderDate(created)}</div>
//       </Pressable>
//     </Link>
//   )
// }
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
