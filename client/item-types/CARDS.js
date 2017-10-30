export const slug = 'card';

export const labels = {
  front    : 'Name',
  back     : 'Description',
  created  : 'Date Created',
  modified : 'Date Modified',
}

export const filterableProps = [ 'front', 'back' ];

export const sortableProps = [
  'front',
  'back',
  'created',
  'modified',
];

export function getProp(card, prop) {
  return card[prop];
}
