export const DeckMeta = {
  publicProps: [
    {value: 'name', label: 'Name'},
    {value: 'description', label: 'Description'},
    {value: 'modified', label: 'Date Modified'},
    {value: 'created', label: 'Date Created'},
  ],
  filterableProps: ['name'],
  prefix: 'deck'
}

export const CardMeta = {
  publicProps: [
    {value: 'front', label: 'Front'},
    {value: 'back', label: 'Back'},
    {value: 'modified', label: 'Date Modified'},
    {value: 'created', label: 'Date Created'},
  ],
  filterableProps: ['front', 'back'],
  prefix: 'card'
}
