export const slug = 'card';

export const labels = {
  front    : 'Front',
  back     : 'Back',
  created  : 'Date Created',
  modified : 'Date Modified',
}

export const filterableProps = [ 'front', 'back' ];

export const sortableProps = [
  'front',
  'back',
  'modified',
  'created',
];

export function getProp(card, prop) {
  return card[prop];
}
