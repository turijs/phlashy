import React from 'react';

class FlexibleItemView extends React.Component {
  constructor(props) {
    super(props);
  }

  filterAndSortItems(items) {
    let {
      sort = 'name',
      sortDesc = false,
      filter = '',
      itemComponent: ItemComp
    } = this.props;

    // NOTE: ItemComp should have properties filterableProps (and sortableProps?)
    // to indicate how it can be sorted/filtered

    // case insensitive filters
    filter = filter.toLowerCase();

    // do filtering
    let filteredItems = items.filter(item => {
      for(let prop of ItemComp.filterableProps)
        if(item[prop].toLowerCase().includes(filter))
          return true;

      return false;
    });

    // do sorting
    let sortedItems = filteredItems.sort((a, b) => {
      return a[sort] < b[sort] ? -1 : +(a[sort] != b[sort]);
    });

    if(sortDesc)
      sortedItems.reverse();

    return sortedItems;
  }

  render() {
    let {items, itemComponent: ItemComp, onItemClick, selectedItems} = this.props;

    items = this.filterAndSortItems(items)

    return (
      <div className="flexible-item-view">
        { items.map(item => (
          <ItemComp
            selected={selectedItems[item.id]}
            onClick={(e) => onItemClick(item.id, e)}
            key={item.id}
            {...item}
          />
        )) }
      </div>
    );
  }
}

//props:
// itemComponent,
// items[],
// itemsState[],
// onItemClick
//

export default FlexibleItemView;
