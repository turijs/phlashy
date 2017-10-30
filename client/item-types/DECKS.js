export const slug = 'deck';

export const labels = {
  name         : 'Name',
  description : 'Description',
  created      : 'Date Created',
  modified     : 'Date Modified',
  size         : 'Size',
}

export const filterableProps = [ 'name' ];

export const sortableProps = [
  'name',
  'description',
  'created',
  'modified',
  'size'
];

export function getProp(deck, prop) {
  switch(prop) {
    case 'size': return deck.cards.length;
    default: return deck[prop];
  }
}
